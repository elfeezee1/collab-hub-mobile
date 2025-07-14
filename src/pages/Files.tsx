
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { FileText, Download, Upload, Search, Filter, Folder, Image, Video, Archive, Eye, Share2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Files = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [files] = useState([
    {
      id: 1,
      name: "Calculus_Chapter_3_Notes.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadedBy: "Sarah Johnson",
      uploadDate: "2 days ago",
      downloads: 15,
      group: "Advanced Mathematics",
      category: "Notes"
    },
    {
      id: 2,
      name: "Integration_Examples.docx",
      type: "docx",
      size: "856 KB",
      uploadedBy: "Mike Chen",
      uploadDate: "1 day ago",
      downloads: 8,
      group: "Advanced Mathematics",
      category: "Exercises"
    },
    {
      id: 3,
      name: "Algorithm_Flowchart.png",
      type: "png",
      size: "1.2 MB",
      uploadedBy: "Emily Davis",
      uploadDate: "3 hours ago",
      downloads: 3,
      group: "Computer Science Fundamentals",
      category: "Diagrams"
    },
    {
      id: 4,
      name: "Physics_Lab_Video.mp4",
      type: "mp4",
      size: "45.6 MB",
      uploadedBy: "Alex Rivera",
      uploadDate: "5 hours ago",
      downloads: 12,
      group: "Physics Study Group",
      category: "Videos"
    },
    {
      id: 5,
      name: "Chemistry_Formulas.zip",
      type: "zip",
      size: "3.8 MB",
      uploadedBy: "Lisa Wang",
      uploadDate: "1 week ago",
      downloads: 25,
      group: "Organic Chemistry Hub",
      category: "Reference"
    },
    {
      id: 6,
      name: "Study_Schedule_Template.xlsx",
      type: "xlsx",
      size: "124 KB",
      uploadedBy: "You",
      uploadDate: "2 weeks ago",
      downloads: 32,
      group: "General",
      category: "Templates"
    }
  ]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'docx':
      case 'txt':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <Image className="h-8 w-8 text-green-500" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="h-8 w-8 text-blue-500" />;
      case 'zip':
      case 'rar':
        return <Archive className="h-8 w-8 text-purple-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-700';
      case 'docx':
        return 'bg-blue-100 text-blue-700';
      case 'png':
      case 'jpg':
        return 'bg-green-100 text-green-700';
      case 'mp4':
        return 'bg-purple-100 text-purple-700';
      case 'zip':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentFiles = filteredFiles.slice(0, 6);
  const myFiles = filteredFiles.filter(file => file.uploadedBy === "You");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadProgress(0);
        }
      }, 200);
    }
  };

  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            File Library
          </h1>
          <p className="text-lg text-muted-foreground">Access and share study materials with your groups</p>
        </div>

        {/* Search and Upload */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files by name, group, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Upload Files</DialogTitle>
                  <DialogDescription>
                    Share study materials with your group members.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PDF, DOC, PPT, IMG up to 50MB</p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Select Files
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* File Tabs */}
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="recent">Recent Files</TabsTrigger>
            <TabsTrigger value="my-files">My Files</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-6">
            {selectedFiles.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{selectedFiles.length} files selected</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentFiles.map((file) => (
                <Card key={file.id} className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div className="flex-1">
                          <CardTitle className="text-sm font-medium truncate">{file.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className={`text-xs ${getFileTypeColor(file.type)}`}>
                              {file.type.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {file.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => toggleFileSelection(file.id)}
                        className="rounded border-gray-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Size: {file.size}</p>
                      <p>Uploaded by: {file.uploadedBy}</p>
                      <p>Group: {file.group}</p>
                      <p>{file.downloads} downloads • {file.uploadDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-files" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myFiles.map((file) => (
                <Card key={file.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <CardTitle className="text-sm font-medium">{file.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className={`text-xs ${getFileTypeColor(file.type)}`}>
                              {file.type.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {file.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Size: {file.size}</p>
                      <p>Group: {file.group}</p>
                      <p>{file.downloads} downloads • {file.uploadDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Notes', 'Exercises', 'Videos', 'Reference', 'Templates', 'Diagrams'].map((category) => (
                <Card key={category} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Folder className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold">{category}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {files.filter(f => f.category === category).length} files
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Files;
