
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Download, Folder, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Files = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch user's files from all groups they're in
  const { data: files, isLoading } = useQuery({
    queryKey: ['files', user?.id],
    queryFn: async () => {
      const { data: groupMembers } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user?.id);

      if (!groupMembers?.length) return [];

      const groupIds = groupMembers.map(g => g.group_id);
      
      // Get files
      const { data: filesData, error } = await supabase
        .from('shared_files')
        .select('*')
        .in('group_id', groupIds)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      if (!filesData?.length) return [];

      // Get group names
      const { data: groupsData } = await supabase
        .from('study_groups')
        .select('id, name')
        .in('id', groupIds);

      // Get profiles
      const userIds = [...new Set(filesData.map(f => f.uploaded_by))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      // Combine data
      const filesWithData = filesData.map(file => ({
        ...file,
        study_groups: groupsData?.find(g => g.id === file.group_id),
        profiles: profilesData?.find(p => p.id === file.uploaded_by)
      }));

      return filesWithData;
    },
    enabled: !!user?.id
  });

  // Fetch user's groups for file upload
  const { data: groups } = useQuery({
    queryKey: ['user-groups', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_groups')
        .select('id, name')
        .in('id', 
          (await supabase
            .from('group_members')
            .select('group_id')
            .eq('user_id', user?.id)
          ).data?.map(g => g.group_id) || []
        );

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, groupId }: { file: File; groupId: string }) => {
      // For demonstration, we'll just store file metadata
      // In a real app, you'd upload to Supabase Storage first
      const { error } = await supabase
        .from('shared_files')
        .insert({
          group_id: groupId,
          uploaded_by: user?.id,
          file_name: file.name,
          file_url: `https://example.com/files/${file.name}`, // Mock URL
          file_size: file.size,
          file_type: file.type
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      setSelectedFile(null);
      toast({
        title: "Success",
        description: "File uploaded successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    }
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Files</h1>
            <p className="text-gray-600">Share and access study materials</p>
          </div>
          
          <div className="flex items-center gap-4">
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Select File
                </span>
              </Button>
            </label>
            
            {selectedFile && groups && groups.length > 0 && (
              <Button
                onClick={() => uploadFileMutation.mutate({ 
                  file: selectedFile, 
                  groupId: groups[0].id 
                })}
                disabled={uploadFileMutation.isPending}
              >
                {uploadFileMutation.isPending ? 'Uploading...' : `Upload ${selectedFile.name}`}
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4">
          {files?.map((file) => (
            <Card key={file.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{file.file_name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{file.file_size ? formatFileSize(file.file_size) : 'Unknown size'}</span>
                      <span>•</span>
                      <span>Uploaded {formatDate(file.uploaded_at)}</span>
                      <span>•</span>
                      <Folder className="h-3 w-3" />
                      <span>{file.study_groups?.name}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      By {file.profiles?.full_name || 'Unknown user'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {files?.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No files yet</h3>
            <p className="text-gray-600 mb-4">Start sharing study materials with your groups!</p>
            <label htmlFor="file-upload">
              <Button asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First File
                </span>
              </Button>
            </label>
          </div>
        )}

        {groups?.length === 0 && (
          <div className="text-center py-12">
            <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Join a study group first</h3>
            <p className="text-gray-600 mb-4">You need to be a member of a study group to share files.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Files;
