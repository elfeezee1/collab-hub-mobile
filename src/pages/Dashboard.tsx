
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Calendar, MessageSquare, FileText, Video, Plus, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeGroups] = useState([
    {
      id: 1,
      name: "Advanced Mathematics",
      members: 8,
      lastActivity: "2 hours ago",
      unreadMessages: 3,
      nextSession: "Tomorrow, 3:00 PM"
    },
    {
      id: 2,
      name: "Computer Science Fundamentals",
      members: 12,
      lastActivity: "30 minutes ago",
      unreadMessages: 7,
      nextSession: "Friday, 2:00 PM"
    },
    {
      id: 3,
      name: "Physics Study Group",
      members: 6,
      lastActivity: "1 day ago",
      unreadMessages: 0,
      nextSession: "Monday, 4:00 PM"
    }
  ]);

  const [upcomingSessions] = useState([
    {
      id: 1,
      title: "Calculus Review Session",
      group: "Advanced Mathematics",
      time: "Tomorrow, 3:00 PM",
      duration: "2 hours"
    },
    {
      id: 2,
      title: "Algorithm Discussion",
      group: "Computer Science Fundamentals",
      time: "Friday, 2:00 PM",
      duration: "1.5 hours"
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            StudyConnect
          </h1>
          <p className="text-lg text-muted-foreground">Your collaborative learning hub</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-muted-foreground">Active Groups</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">10</div>
              <div className="text-sm text-muted-foreground">New Messages</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">2</div>
              <div className="text-sm text-muted-foreground">Upcoming Sessions</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">15</div>
              <div className="text-sm text-muted-foreground">Shared Files</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Study Groups */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">My Study Groups</h2>
              <Button onClick={() => navigate('/groups')} size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>

            <div className="space-y-4">
              {activeGroups.map((group) => (
                <Card key={group.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => navigate(`/groups/${group.id}`)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">{group.name}</h3>
                            <p className="text-sm text-muted-foreground">{group.members} members • Last active {group.lastActivity}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            Next session: {group.nextSession}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {group.unreadMessages > 0 && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {group.unreadMessages} new
                          </Badge>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); navigate(`/groups/${group.id}/chat`); }}>
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); navigate(`/groups/${group.id}/video`); }}>
                            <Video className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Sessions Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <h4 className="font-semibold text-sm">{session.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{session.group}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs font-medium text-blue-600">{session.time}</span>
                      <Badge variant="outline" className="text-xs">{session.duration}</Badge>
                    </div>
                  </div>
                ))}
                <Button className="w-full" variant="outline" onClick={() => navigate('/schedule')}>
                  View All Sessions
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Recent Files
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Calculus Notes.pdf</p>
                    <p className="text-xs text-muted-foreground">Advanced Mathematics</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <FileText className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Algorithm Summary.docx</p>
                    <p className="text-xs text-muted-foreground">Computer Science</p>
                  </div>
                </div>
                <Button className="w-full" variant="outline" onClick={() => navigate('/files')}>
                  Browse All Files
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
