'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Dynamically import the map component with no SSR to avoid window is not defined errors
const IssueMap = dynamic(() => import('@/components/map/IssueMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-muted rounded-xl">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
});

export default function IssuesPage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await api.get('/issues');
        setIssues(res.data);
      } catch (error) {
        console.error('Failed to fetch issues:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore Issues</h1>
          <p className="text-muted-foreground">Discover verified issues reported by the community in real-time.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 h-[calc(100%-6rem)]">
        {/* Map Area */}
        <div className="md:col-span-2 rounded-xl relative h-full">
          <IssueMap issues={issues} />
        </div>

        {/* List Area */}
        <div className="flex flex-col h-full overflow-hidden">
          <Card className="h-full flex flex-col">
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-lg">Recent Reports</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : issues.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-8">No issues reported yet.</p>
              ) : (
                issues.map((issue) => (
                  <div key={issue._id} className="flex flex-col p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm line-clamp-1">{issue.title}</h4>
                      <Badge variant={issue.status === 'resolved' ? 'default' : 'outline'}>
                        {issue.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="line-clamp-1">{issue.location?.address || 'Location unknown'}</span>
                    </div>
                    {issue.aiAnalysis?.summary && (
                      <p className="text-xs text-primary mt-2 border-t pt-2 mt-2 font-medium">
                        AI Summary: {issue.aiAnalysis.summary.substring(0, 40)}...
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
