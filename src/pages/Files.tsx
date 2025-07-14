
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Download } from 'lucide-react';

const Files = () => {
  const mockFiles = [
    { name: "Calculus Notes.pdf", size: "2.5 MB", uploaded: "2 days ago" },
    { name: "Physics Lab Report.docx", size: "1.2 MB", uploaded: "1 week ago" },
    { name: "Chemistry Formulas.pdf", size: "800 KB", uploaded: "3 days ago" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Files</h1>
            <p className="text-gray-600">Share and access study materials</p>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        </div>

        <div className="grid gap-4">
          {mockFiles.map((file, index) => (
            <Card key={index}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{file.name}</h3>
                    <p className="text-sm text-gray-600">{file.size} • {file.uploaded}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Files;
