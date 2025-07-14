
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, Video, Phone, MoreVertical, Users } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const Chat = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [groupInfo] = useState({
    name: "Advanced Mathematics",
    members: 8,
    onlineMembers: 3
  });

  const [messages] = useState([
    {
      id: 1,
      sender: "Sarah Johnson",
      avatar: "/placeholder.svg",
      content: "Hey everyone! I've uploaded the calculus notes from today's lecture. Check them out in the files section.",
      timestamp: "10:30 AM",
      isMe: false
    },
    {
      id: 2,
      sender: "You",
      avatar: "/placeholder.svg",
      content: "Thanks Sarah! This will be really helpful for the upcoming exam.",
      timestamp: "10:32 AM",
      isMe: true
    },
    {
      id: 3,
      sender: "Mike Chen",
      avatar: "/placeholder.svg",
      content: "Can someone explain the integration by parts method? I'm still confused about when to use it.",
      timestamp: "10:35 AM",
      isMe: false
    },
    {
      id: 4,
      sender: "Emily Davis",
      avatar: "/placeholder.svg",
      content: "Sure! Integration by parts is used when you have a product of two functions. The formula is ∫u dv = uv - ∫v du",
      timestamp: "10:37 AM",
      isMe: false
    },
    {
      id: 5,
      sender: "You",
      avatar: "/placeholder.svg",
      content: "That's a great explanation Emily! Should we schedule a study session to go over more examples?",
      timestamp: "10:40 AM",
      isMe: true
    },
    {
      id: 6,
      sender: "Sarah Johnson",
      avatar: "/placeholder.svg",
      content: "Absolutely! How about tomorrow at 3 PM? We can use the video chat feature.",
      timestamp: "10:42 AM",
      isMe: false
    }
  ]);

  const [onlineMembers] = useState([
    { name: "Sarah Johnson", avatar: "/placeholder.svg", status: "online" },
    { name: "Mike Chen", avatar: "/placeholder.svg", status: "online" },
    { name: "Emily Davis", avatar: "/placeholder.svg", status: "away" },
    { name: "Alex Rivera", avatar: "/placeholder.svg", status: "offline" },
    { name: "Lisa Wang", avatar: "/placeholder.svg", status: "online" }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex h-screen">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white/80 backdrop-blur-sm border-b p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                  ←
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{groupInfo.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {groupInfo.onlineMembers} online • {groupInfo.members} members
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="bg-green-50 hover:bg-green-100 border-green-200">
                  <Video className="h-4 w-4 mr-2 text-green-600" />
                  Video Call
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={msg.avatar} />
                    <AvatarFallback>{msg.sender.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col ${msg.isMe ? 'items-end' : ''} max-w-md`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{msg.sender}</span>
                      <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      msg.isMe 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'bg-white shadow-sm border'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="bg-white/80 backdrop-blur-sm border-t p-4">
            <div className="flex items-center gap-3 max-w-4xl mx-auto">
              <Button size="sm" variant="outline">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-white/80 backdrop-blur-sm border-0 shadow-sm"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Members Sidebar */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-l p-4 hidden lg:block">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Members ({groupInfo.members})</h3>
              <div className="space-y-3">
                {onlineMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        member.status === 'online' ? 'bg-green-500' : 
                        member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{member.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate(`/groups/${groupId}/files`)}>
                  📁 Browse Files
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate(`/groups/${groupId}/schedule`)}>
                  📅 Schedule Session
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🎯 Create Poll
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📝 Take Notes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
