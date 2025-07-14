
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, Search, Plus, BookOpen, MessageSquare, Calendar, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Groups = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupSubject, setNewGroupSubject] = useState('');

  const [allGroups] = useState([
    {
      id: 1,
      name: "Advanced Mathematics",
      description: "Calculus, Linear Algebra, and Differential Equations study group",
      subject: "Mathematics",
      members: 8,
      isJoined: true,
      privacy: "Public",
      lastActivity: "2 hours ago"
    },
    {
      id: 2,
      name: "Computer Science Fundamentals",
      description: "Data Structures, Algorithms, and Programming concepts",
      subject: "Computer Science",
      members: 12,
      isJoined: true,
      privacy: "Public",
      lastActivity: "30 minutes ago"
    },
    {
      id: 3,
      name: "Physics Study Group",
      description: "Classical Mechanics and Thermodynamics",
      subject: "Physics",
      members: 6,
      isJoined: true,
      privacy: "Private",
      lastActivity: "1 day ago"
    },
    {
      id: 4,
      name: "Organic Chemistry Hub",
      description: "Molecular structures, reactions, and mechanisms",
      subject: "Chemistry",
      members: 15,
      isJoined: false,
      privacy: "Public",
      lastActivity: "4 hours ago"
    },
    {
      id: 5,
      name: "English Literature Circle",
      description: "Classic and contemporary literature analysis",
      subject: "Literature",
      members: 9,
      isJoined: false,
      privacy: "Public",
      lastActivity: "1 hour ago"
    },
    {
      id: 6,
      name: "Business Strategy Forum",
      description: "Case studies and strategic management discussions",
      subject: "Business",
      members: 18,
      isJoined: false,
      privacy: "Private",
      lastActivity: "6 hours ago"
    }
  ]);

  const filteredGroups = allGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const myGroups = filteredGroups.filter(group => group.isJoined);
  const availableGroups = filteredGroups.filter(group => !group.isJoined);

  const handleCreateGroup = () => {
    console.log('Creating group:', { newGroupName, newGroupDescription, newGroupSubject });
    // Reset form
    setNewGroupName('');
    setNewGroupDescription('');
    setNewGroupSubject('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Study Groups
          </h1>
          <p className="text-lg text-muted-foreground">Join existing groups or create your own</p>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups by name, subject, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
            />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Study Group</DialogTitle>
                <DialogDescription>
                  Create a new study group to collaborate with your peers.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Enter group name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={newGroupSubject}
                    onChange={(e) => setNewGroupSubject(e.target.value)}
                    placeholder="e.g., Mathematics, Computer Science"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    placeholder="Describe what this group will study"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateGroup} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Create Group
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* My Groups */}
        {myGroups.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">My Groups</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myGroups.map((group) => (
                <Card key={group.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => navigate(`/groups/${group.id}`)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{group.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1 text-xs">{group.subject}</Badge>
                        </div>
                      </div>
                      <Badge variant={group.privacy === 'Private' ? 'destructive' : 'default'} className="text-xs">
                        {group.privacy}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription>{group.description}</CardDescription>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {group.members} members
                      </div>
                      <span>Active {group.lastActivity}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={(e) => { e.stopPropagation(); navigate(`/groups/${group.id}/chat`); }}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); navigate(`/groups/${group.id}/schedule`); }}>
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); }}>
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Groups */}
        {availableGroups.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Available Groups</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableGroups.map((group) => (
                <Card key={group.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1 text-xs">{group.subject}</Badge>
                        </div>
                      </div>
                      <Badge variant={group.privacy === 'Private' ? 'destructive' : 'default'} className="text-xs">
                        {group.privacy}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription>{group.description}</CardDescription>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {group.members} members
                      </div>
                      <span>Active {group.lastActivity}</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                      {group.privacy === 'Private' ? 'Request to Join' : 'Join Group'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No groups found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search terms or create a new group.</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Group
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
