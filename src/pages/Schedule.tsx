
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Clock, Users, Video, MapPin, Plus, Bell, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionDescription, setNewSessionDescription] = useState('');
  const [newSessionGroup, setNewSessionGroup] = useState('');
  const [newSessionDuration, setNewSessionDuration] = useState('');

  const [upcomingSessions] = useState([
    {
      id: 1,
      title: "Calculus Review Session",
      description: "Going over integration techniques and practice problems",
      group: "Advanced Mathematics",
      date: "2024-07-15",
      time: "15:00",
      duration: "2 hours",
      type: "Study Session",
      location: "Online - Video Chat",
      attendees: 6,
      maxAttendees: 10,
      isCreator: false
    },
    {
      id: 2,
      title: "Algorithm Discussion",
      description: "Discussing sorting algorithms and time complexity",
      group: "Computer Science Fundamentals",
      date: "2024-07-16",
      time: "14:00",
      duration: "1.5 hours",
      type: "Discussion",
      location: "Library Room 203",
      attendees: 8,
      maxAttendees: 12,
      isCreator: true
    },
    {
      id: 3,
      title: "Physics Lab Prep",
      description: "Preparing for the thermodynamics lab experiment",
      group: "Physics Study Group",
      date: "2024-07-18",
      time: "16:00",
      duration: "1 hour",
      type: "Preparation",
      location: "Online - Video Chat",
      attendees: 4,
      maxAttendees: 8,
      isCreator: false
    },
    {
      id: 4,
      title: "Midterm Study Marathon",
      description: "Intensive study session covering all chapters",
      group: "Advanced Mathematics",
      date: "2024-07-20",
      time: "10:00",
      duration: "4 hours",
      type: "Study Session",
      location: "Study Hall A",
      attendees: 12,
      maxAttendees: 15,
      isCreator: true
    }
  ]);

  const [assignments] = useState([
    {
      id: 1,
      title: "Calculus Problem Set 5",
      course: "Advanced Mathematics",
      dueDate: "2024-07-17",
      dueTime: "23:59",
      priority: "High",
      status: "In Progress"
    },
    {
      id: 2,
      title: "Algorithm Analysis Report",
      course: "Computer Science Fundamentals",
      dueDate: "2024-07-19",
      dueTime: "15:00",
      priority: "High",
      status: "Not Started"
    },
    {
      id: 3,
      title: "Physics Lab Report",
      course: "Physics Study Group",
      dueDate: "2024-07-22",
      dueTime: "12:00",
      priority: "Medium",
      status: "Completed"
    },
    {
      id: 4,
      title: "Literature Essay Draft",
      course: "English Literature Circle",
      dueDate: "2024-07-25",
      dueTime: "18:00",
      priority: "Low",
      status: "Not Started"
    }
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Study Session':
        return 'bg-blue-100 text-blue-700';
      case 'Discussion':
        return 'bg-green-100 text-green-700';
      case 'Preparation':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Not Started':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCreateSession = () => {
    console.log('Creating session:', {
      title: newSessionTitle,
      description: newSessionDescription,
      group: newSessionGroup,
      duration: newSessionDuration,
      date: selectedDate
    });
    // Reset form
    setNewSessionTitle('');
    setNewSessionDescription('');
    setNewSessionGroup('');
    setNewSessionDuration('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Schedule & Tasks
          </h1>
          <p className="text-lg text-muted-foreground">Manage your study sessions and track assignments</p>
        </div>

        {/* Schedule Tabs */}
        <Tabs defaultValue="sessions" className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <TabsList className="bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="sessions">Study Sessions</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Schedule New Study Session</DialogTitle>
                  <DialogDescription>
                    Create a new study session for your group members.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Session Title</Label>
                    <Input
                      id="title"
                      value={newSessionTitle}
                      onChange={(e) => setNewSessionTitle(e.target.value)}
                      placeholder="Enter session title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="group">Study Group</Label>
                    <Select value={newSessionGroup} onValueChange={setNewSessionGroup}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Advanced Mathematics</SelectItem>
                        <SelectItem value="cs">Computer Science Fundamentals</SelectItem>
                        <SelectItem value="physics">Physics Study Group</SelectItem>
                        <SelectItem value="chemistry">Organic Chemistry Hub</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select value={newSessionDuration} onValueChange={setNewSessionDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30min">30 minutes</SelectItem>
                        <SelectItem value="1hr">1 hour</SelectItem>
                        <SelectItem value="1.5hr">1.5 hours</SelectItem>
                        <SelectItem value="2hr">2 hours</SelectItem>
                        <SelectItem value="3hr">3 hours</SelectItem>
                        <SelectItem value="4hr">4+ hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newSessionDescription}
                      onChange={(e) => setNewSessionDescription(e.target.value)}
                      placeholder="Describe what will be covered in this session"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateSession} className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Schedule Session
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="sessions" className="space-y-6">
            <div className="grid gap-6">
              {upcomingSessions.map((session) => (
                <Card key={session.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold">{session.title}</h3>
                            <p className="text-muted-foreground mt-1">{session.description}</p>
                          </div>
                          <Badge variant="secondary" className={`${getTypeColor(session.type)} ml-4`}>
                            {session.type}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-blue-600" />
                            <span>{format(new Date(session.date), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-green-600" />
                            <span>{session.time} ({session.duration})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-600" />
                            <span>{session.attendees}/{session.maxAttendees} attending</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {session.location.includes('Online') ? (
                              <Video className="h-4 w-4 text-orange-600" />
                            ) : (
                              <MapPin className="h-4 w-4 text-orange-600" />
                            )}
                            <span className="truncate">{session.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Group:</span>
                          <Badge variant="outline">{session.group}</Badge>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 lg:w-40">
                        <Button size="sm" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                          <Bell className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                        {session.isCreator && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <div className="grid gap-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold">{assignment.title}</h3>
                            <p className="text-muted-foreground">{assignment.course}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className={getPriorityColor(assignment.priority)}>
                              {assignment.priority}
                            </Badge>
                            <Badge variant="secondary" className={getStatusColor(assignment.status)}>
                              {assignment.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-red-600" />
                            <span>Due: {format(new Date(assignment.dueDate), 'MMM dd, yyyy')} at {assignment.dueTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Update Status
                        </Button>
                        <Button size="sm" variant="outline">
                          <Bell className="h-4 w-4 mr-2" />
                          Set Reminder
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>Select a date to view scheduled events</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border-0"
                  />
                </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>
                      Events for {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Selected Date'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingSessions
                      .filter(session => selectedDate && format(new Date(session.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
                      .map(session => (
                        <div key={session.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{session.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{session.group}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {session.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {session.attendees} attending
                                </span>
                              </div>
                            </div>
                            <Badge variant="secondary" className={getTypeColor(session.type)}>
                              {session.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    {assignments
                      .filter(assignment => selectedDate && format(new Date(assignment.dueDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
                      .map(assignment => (
                        <div key={assignment.id} className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{assignment.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{assignment.course}</p>
                              <div className="flex items-center gap-2 mt-2 text-sm">
                                <span>Due at {assignment.dueTime}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className={getPriorityColor(assignment.priority)}>
                                {assignment.priority}
                              </Badge>
                              <Badge variant="secondary" className={getStatusColor(assignment.status)}>
                                {assignment.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    {(!selectedDate || (
                      upcomingSessions.filter(session => format(new Date(session.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')).length === 0 &&
                      assignments.filter(assignment => format(new Date(assignment.dueDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')).length === 0
                    )) && (
                      <div className="text-center py-8 text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No events scheduled for this date</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Schedule;
