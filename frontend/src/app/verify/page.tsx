'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, ShieldAlert, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function VerifyIssuePage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/issues')
      .then((res) => {
        // Filter for issues that might need verification
        const pending = res.data.filter((i: any) => i.status === 'raised' || i.trustScore < 90);
        setIssues(pending);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleVote = (issueId: string, type: 'up' | 'down') => {
    if (type === 'up') toast.success('You verified this issue as genuine!');
    else toast.error('You marked this issue as fake.');
    // In a real app, this would be an API call, e.g., api.post(`/issues/${issueId}/vote`, { type })
    setIssues(prev => prev.filter(i => i._id !== issueId));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Verify Issues</h1>
          <p className="text-muted-foreground">Help maintain platform trust by verifying issues in your locality.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg flex items-center gap-2 font-bold">
          <ShieldAlert className="w-5 h-5" /> Trust Engine Active
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-50" />
          <p>All local issues have been verified. Great job!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {issues.map((issue) => (
            <Card key={issue._id} className="overflow-hidden shadow-md">
              <img src={issue.images?.[0] || issue.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&q=80'} alt={issue.title} className="w-full h-48 object-cover" />
              <CardHeader className="pb-2">
                <div className="text-xs text-muted-foreground font-mono mb-1">#{issue._id.substring(0,8)}</div>
                <CardTitle className="text-lg">{issue.title}</CardTitle>
                <CardDescription>Trust Score: {issue.trustScore}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-6 line-clamp-3">{issue.description}</p>
                
                <div className="p-4 bg-muted/50 rounded-lg border border-dashed mb-6">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3 text-center">Is this issue genuine?</h4>
                  <div className="flex gap-4">
                    <Button className="w-full bg-green-600 hover:bg-green-700 gap-2" onClick={() => handleVote(issue._id, 'up')}>
                      <ThumbsUp className="w-4 h-4" /> Yes, it's real
                    </Button>
                    <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 gap-2" onClick={() => handleVote(issue._id, 'down')}>
                      <ThumbsDown className="w-4 h-4" /> No, it's fake
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
