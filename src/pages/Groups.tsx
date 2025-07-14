
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, Plus, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Groups = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    subject: ''
  });

  // Fetch all groups with member info
  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_groups')
        .select(`
          *,
          group_members(user_id, role)
        `);

      if (error) throw error;
      
      // Add member count and user's membership status
      return data?.map(group => ({
        ...group,
        memberCount: group.group_members?.length || 0,
        userIsMember: group.group_members?.some(member => member.user_id === user?.id) || false,
        userRole: group.group_members?.find(member => member.user_id === user?.id)?.role
      })) || [];
    },
    enabled: !!user?.id
  });

  // Create new group mutation
  const createGroupMutation = useMutation({
    mutationFn: async (groupData: typeof newGroup) => {
      const { data: group, error: groupError } = await supabase
        .from('study_groups')
        .insert({
          name: groupData.name,
          description: groupData.description,
          subject: groupData.subject,
          created_by: user?.id
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user?.id,
          role: 'admin'
        });

      if (memberError) throw memberError;
      return group;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsCreateDialogOpen(false);
      setNewGroup({ name: '', description: '', subject: '' });
      toast({
        title: "Success",
        description: "Study group created successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create study group. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    }
  });

  const handleCreateGroup = () => {
    if (!newGroup.name.trim()) {
      toast({
        title: "Error",
        description: "Group name is required",
        variant: "destructive"
      });
      return;
    }
    createGroupMutation.mutate(newGroup);
  };

  // Join group mutation
  const joinGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user?.id,
          role: 'member'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({
        title: "Success",
        description: "Joined group successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to join group. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    }
  });

  const handleJoinGroup = (groupId: string) => {
    joinGroupMutation.mutate(groupId);
  };

  const handleJoinChat = (groupId: string) => {
    navigate(`/groups/${groupId}/chat`);
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Groups</h1>
            <p className="text-gray-600">Join or create study groups to collaborate with peers</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Study Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter group name"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={newGroup.subject}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="e.g., Mathematics, Physics, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this group is about"
                  />
                </div>
                <Button 
                  onClick={handleCreateGroup} 
                  className="w-full"
                  disabled={createGroupMutation.isPending}
                >
                  {createGroupMutation.isPending ? 'Creating...' : 'Create Group'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups?.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  {group.name}
                </CardTitle>
                <CardDescription>{group.description}</CardDescription>
                {group.subject && (
                  <div className="text-sm text-blue-600 font-medium">{group.subject}</div>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">
                    {group.memberCount} members
                  </span>
                  {group.userRole && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {group.userRole}
                    </span>
                  )}
                </div>
                {group.userIsMember ? (
                  <Button 
                    className="w-full" 
                    onClick={() => handleJoinChat(group.id)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Open Chat
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleJoinGroup(group.id)}
                    disabled={joinGroupMutation.isPending}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {joinGroupMutation.isPending ? 'Joining...' : 'Join Group'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {groups?.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No study groups yet</h3>
            <p className="text-gray-600 mb-4">Create your first study group to get started!</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Group
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
