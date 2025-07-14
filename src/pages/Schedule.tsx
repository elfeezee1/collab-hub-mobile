
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Schedule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    groupId: '',
    scheduledAt: '',
    durationMinutes: 60
  });

  // Fetch user's study sessions
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions', user?.id],
    queryFn: async () => {
      const { data: groupMembers } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user?.id);

      if (!groupMembers?.length) return [];

      const groupIds = groupMembers.map(g => g.group_id);
      
      const { data, error } = await supabase
        .from('study_sessions')
        .select(`
          *,
          study_groups(name),
          profiles(full_name)
        `)
        .in('group_id', groupIds)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch user's groups for session creation
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

  // Create new session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: typeof newSession) => {
      const { error } = await supabase
        .from('study_sessions')
        .insert({
          title: sessionData.title,
          description: sessionData.description,
          group_id: sessionData.groupId,
          scheduled_at: sessionData.scheduledAt,
          duration_minutes: sessionData.durationMinutes,
          created_by: user?.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      setIsCreateDialogOpen(false);
      setNewSession({
        title: '',
        description: '',
        groupId: '',
        scheduledAt: '',
        durationMinutes: 60
      });
      toast({
        title: "Success",
        description: "Study session scheduled successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to schedule session. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    }
  });

  const handleCreateSession = () => {
    if (!newSession.title.trim() || !newSession.groupId || !newSession.scheduledAt) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    createSessionMutation.mutate(newSession);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionStatus = (scheduledAt: string) => {
    const now = new Date();
    const sessionDate = new Date(scheduledAt);
    
    if (sessionDate < now) return { label: 'Past', color: 'bg-gray-100 text-gray-800' };
    if (sessionDate.toDateString() === now.toDateString()) return { label: 'Today', color: 'bg-blue-100 text-blue-800' };
    return { label: 'Upcoming', color: 'bg-green-100 text-green-800' };
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule</h1>
            <p className="text-gray-600">Manage your study sessions and deadlines</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Study Session</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Session Title</Label>
                  <Input
                    id="title"
                    value={newSession.title}
                    onChange={(e) => setNewSession(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter session title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="group">Study Group</Label>
                  <Select value={newSession.groupId} onValueChange={(value) => setNewSession(prev => ({ ...prev, groupId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups?.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="datetime">Date & Time</Label>
                  <Input
                    id="datetime"
                    type="datetime-local"
                    value={newSession.scheduledAt}
                    onChange={(e) => setNewSession(prev => ({ ...prev, scheduledAt: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newSession.durationMinutes}
                    onChange={(e) => setNewSession(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) || 60 }))}
                    placeholder="60"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newSession.description}
                    onChange={(e) => setNewSession(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Session details (optional)"
                  />
                </div>

                <Button 
                  onClick={handleCreateSession} 
                  className="w-full"
                  disabled={createSessionMutation.isPending}
                >
                  {createSessionMutation.isPending ? 'Scheduling...' : 'Schedule Session'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {sessions?.map((session) => {
            const status = getSessionStatus(session.scheduled_at);
            return (
              <Card key={session.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{session.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{formatDateTime(session.scheduled_at)}</span>
                        <span>•</span>
                        <span>{session.duration_minutes} min</span>
                        <span>•</span>
                        <span>{session.study_groups?.name}</span>
                      </div>
                      {session.description && (
                        <p className="text-sm text-gray-600 mt-1">{session.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {sessions?.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions scheduled</h3>
            <p className="text-gray-600 mb-4">Create your first study session to get started!</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Your First Session
            </Button>
          </div>
        )}

        {groups?.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Join a study group first</h3>
            <p className="text-gray-600 mb-4">You need to be a member of a study group to schedule sessions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
