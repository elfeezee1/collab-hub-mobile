
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, MessageSquare } from 'lucide-react';

const Groups = () => {
  const mockGroups = [
    {
      id: 1,
      name: "Mathematics Study Group",
      description: "Calculus and Linear Algebra",
      members: 8,
      messages: 156
    },
    {
      id: 2,
      name: "Physics Research Team",
      description: "Quantum Mechanics Studies",
      members: 5,
      messages: 89
    },
    {
      id: 3,
      name: "Computer Science Club",
      description: "Algorithm Practice",
      members: 12,
      messages: 203
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Groups</h1>
            <p className="text-gray-600">Join or create study groups to collaborate with peers</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  {group.name}
                </CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">{group.members} members</span>
                  <span className="text-sm text-gray-600">{group.messages} messages</span>
                </div>
                <Button className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Join Group
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Groups;
