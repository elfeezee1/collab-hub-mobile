
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Calendar, FileText, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch dashboard statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      const [groupsResult, messagesResult, sessionsResult, filesResult] = await Promise.all([
        supabase
          .from('group_members')
          .select('group_id')
          .eq('user_id', user?.id),
        supabase
          .from('messages')
          .select('id, group_id')
          .in('group_id', 
            (await supabase
              .from('group_members')
              .select('group_id')
              .eq('user_id', user?.id)
            ).data?.map(g => g.group_id) || []
          ),
        supabase
          .from('study_sessions')
          .select('id')
          .in('group_id',
            (await supabase
              .from('group_members')
              .select('group_id')
              .eq('user_id', user?.id)
            ).data?.map(g => g.group_id) || []
          )
          .gte('scheduled_at', new Date().toISOString().split('T')[0]),
        supabase
          .from('shared_files')
          .select('id')
          .in('group_id',
            (await supabase
              .from('group_members')
              .select('group_id')
              .eq('user_id', user?.id)
            ).data?.map(g => g.group_id) || []
          )
      ]);

      return {
        groups: groupsResult.data?.length || 0,
        messages: messagesResult.data?.length || 0,
        sessions: sessionsResult.data?.length || 0,
        files: filesResult.data?.length || 0
      };
    },
    enabled: !!user?.id
  });

  // Fetch recent activity
  const { data: recentMessages } = useQuery({
    queryKey: ['recent-messages', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          study_groups(name),
          profiles(full_name)
        `)
        .in('group_id',
          (await supabase
            .from('group_members')
            .select('group_id')
            .eq('user_id', user?.id)
          ).data?.map(g => g.group_id) || []
        )
        .order('created_at', { ascending: false })
        .limit(5);
      
      return data || [];
    },
    enabled: !!user?.id
  });

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your study groups.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Groups</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.groups || 0}</div>
              <p className="text-xs text-gray-600">Active groups</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.messages || 0}</div>
              <p className="text-xs text-gray-600">Total messages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.sessions || 0}</div>
              <p className="text-xs text-gray-600">Upcoming sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shared Files</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.files || 0}</div>
              <p className="text-xs text-gray-600">Recent uploads</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your study groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMessages?.map((message) => (
                  <div key={message.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <p className="text-sm">
                      <span className="font-medium">
                        {message.profiles?.full_name || 'Someone'}
                      </span>
                      {' posted in '}
                      <span className="font-medium text-blue-600">
                        {message.study_groups?.name}
                      </span>
                    </p>
                  </div>
                )) || (
                  <p className="text-sm text-gray-500">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start"
                  onClick={() => navigate('/groups')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Study Group
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/messages')}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start Chat
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/schedule')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
