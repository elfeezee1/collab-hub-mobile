
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send } from 'lucide-react';

const Chat = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="h-[calc(100vh-8rem)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Study Group Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="font-semibold text-sm text-blue-600">John Doe</p>
                  <p className="text-gray-700">Hey everyone! Ready for today's study session?</p>
                  <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg shadow-sm ml-8">
                  <p className="font-semibold text-sm text-green-600">You</p>
                  <p className="text-gray-700">Yes! I've prepared the notes for Chapter 3.</p>
                  <p className="text-xs text-gray-500 mt-1">10:32 AM</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Type your message..." className="flex-1" />
              <Button>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
