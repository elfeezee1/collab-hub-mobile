import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Plus, Search, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Conversations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch user's conversations
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant1_id.eq.${user?.id},participant2_id.eq.${user?.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      if (!data?.length) return [];

      // Get the last message for each conversation
      const conversationIds = data.map(conv => conv.id);
      const { data: lastMessages } = await supabase
        .from('private_messages')
        .select('conversation_id, content, created_at')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false });

      // Get profiles for all participants
      const participantIds = data.flatMap(conv => [conv.participant1_id, conv.participant2_id])
        .filter(id => id !== user?.id);
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .in('id', participantIds);

      if (profilesError) throw profilesError;

      // Combine conversation data with participant profiles and last messages
      return data.map(conv => {
        const otherParticipantId = conv.participant1_id === user?.id ? conv.participant2_id : conv.participant1_id;
        const otherParticipant = profiles?.find(p => p.id === otherParticipantId);
        const lastMessage = lastMessages?.find(msg => msg.conversation_id === conv.id);
        
        return {
          ...conv,
          otherParticipant,
          lastMessage
        };
      });
    },
    enabled: !!user?.id
  });

  // Fetch all users for starting new conversations
  const { data: users } = useQuery({
    queryKey: ['users', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .neq('id', user?.id);

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.limit(10);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && isNewChatOpen
  });

  // Start new conversation mutation
  const startConversationMutation = useMutation({
    mutationFn: async (otherUserId: string) => {
      // Check if conversation already exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant1_id.eq.${user?.id},participant2_id.eq.${otherUserId}),and(participant1_id.eq.${otherUserId},participant2_id.eq.${user?.id})`)
        .single();

      if (existing) {
        return existing.id;
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          participant1_id: user?.id,
          participant2_id: otherUserId
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    },
    onSuccess: (conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setIsNewChatOpen(false);
      navigate(`/conversations/${conversationId}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    }
  });

  const handleStartConversation = (userId: string) => {
    startConversationMutation.mutate(userId);
  };

  const handleOpenChat = (conversationId: string) => {
    navigate(`/conversations/${conversationId}`);
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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Conversations</h1>
            <p className="text-gray-600">Private messages with other users</p>
          </div>
          
          <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Chat
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start New Conversation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {users?.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleStartConversation(user.id)}
                    >
                      <Avatar>
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>
                          {user.full_name?.[0] || user.username?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.full_name || user.username}</div>
                        {user.full_name && user.username && (
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        )}
                      </div>
                    </div>
                  ))}
                  {users?.length === 0 && searchTerm && (
                    <div className="text-center py-4 text-gray-500">
                      No users found
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {conversations?.map((conversation) => (
            <Card key={conversation.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleOpenChat(conversation.id)}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={conversation.otherParticipant?.avatar_url} />
                    <AvatarFallback>
                      {conversation.otherParticipant?.full_name?.[0] || conversation.otherParticipant?.username?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.otherParticipant?.full_name || conversation.otherParticipant?.username || 'Unknown User'}
                      </h3>
                      {conversation.lastMessage && (
                        <span className="text-sm text-gray-500">
                          {new Date(conversation.lastMessage.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage ? (
                      <p className="text-gray-600 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-gray-400 italic">No messages yet</p>
                    )}
                  </div>
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {conversations?.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-600 mb-4">Start a private conversation with someone!</p>
            <Button onClick={() => setIsNewChatOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Start Your First Chat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;