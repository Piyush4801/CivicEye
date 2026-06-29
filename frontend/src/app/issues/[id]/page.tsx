'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, MapPin, Upload, AlertTriangle, Clock, History, Camera, Loader2, ArrowLeft, Bot, FileWarning, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function IssueDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [issue, setIssue] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchIssue = async () => {
    try {
      const res = await api.get(`/issues/${id}`);
      setIssue(res.data);
    } catch (error) {
      console.error('Failed to fetch issue details', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const handleEvidenceUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('evidence', evidenceFile);

    try {
      await api.post(`/issues/${id}/evidence`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Evidence uploaded successfully! Trust score updated.');
      setEvidenceFile(null);
      fetchIssue(); // Refresh data
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload evidence');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Issue not found</h1>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Map
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Main Issue Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            {issue.imageUrl && (
              <img src={issue.imageUrl} alt={issue.title} className="w-full h-64 object-cover rounded-t-xl" />
            )}
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-2xl">{issue.title}</CardTitle>
                <Badge variant={issue.status === 'completed' ? 'default' : 'secondary'}>
                  {issue.status.toUpperCase()}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {issue.location?.coordinates?.join(', ')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{issue.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline">Severity: {issue.severity}</Badge>
                <Badge variant="outline">Category: {issue.category}</Badge>
              </div>

              {/* Upload Evidence Section */}
              <div className="bg-muted/30 p-4 rounded-xl border border-dashed">
                <h3 className="font-bold mb-2 flex items-center gap-2"><Camera className="h-4 w-4" /> Upload Supporting Evidence</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add photos of the issue to increase its Trust Score and prioritize it for the government.
                </p>
                <form onSubmit={handleEvidenceUpload} className="flex gap-2">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="cursor-pointer"
                    onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
                  />
                  <Button type="submit" disabled={!evidenceFile || isUploading}>
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                    Upload
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Evidence Gallery */}
          {issue.evidence && issue.evidence.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Community Evidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {issue.evidence.map((ev: any, idx: number) => (
                    <img key={idx} src={ev.url} alt="Evidence" className="w-full h-32 object-cover rounded-lg border hover:scale-105 transition-transform" />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verification Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Verification Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
                {issue.verificationTimeline?.map((item: any, idx: number) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow
                      ${item.actorType === 'ai' ? 'bg-purple-100 text-purple-600' : 
                        item.actorType === 'citizen' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`
                    }>
                      {item.actorType === 'ai' ? <Bot className="h-5 w-5" /> : 
                       item.actorType === 'citizen' ? <ShieldCheck className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border bg-card shadow">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm">{item.action}</h4>
                        <span className="text-[10px] text-muted-foreground uppercase">{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Trust Engine */}
        <div className="space-y-6">
          <Card className={`border-2 ${issue.trustScore > 70 ? 'border-green-500/50 bg-green-50/10' : issue.trustScore > 40 ? 'border-yellow-500/50 bg-yellow-50/10' : 'border-red-500/50 bg-red-50/10'}`}>
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Community Trust Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className={`text-6xl font-black mb-2
                ${issue.trustScore > 70 ? 'text-green-600' : issue.trustScore > 40 ? 'text-yellow-600' : 'text-red-600'}
              `}>
                {issue.trustScore}
              </div>
              <Badge variant="outline" className={`font-bold text-sm
                 ${issue.confidenceMeter === 'Verified' ? 'border-green-500 text-green-700 bg-green-100' : 
                   issue.confidenceMeter === 'High' ? 'border-blue-500 text-blue-700 bg-blue-100' : 
                   issue.confidenceMeter === 'Medium' ? 'border-yellow-500 text-yellow-700 bg-yellow-100' : 'border-red-500 text-red-700 bg-red-100'}
              `}>
                {issue.confidenceMeter} Confidence
              </Badge>
            </CardContent>
          </Card>

          {issue.aiAnalysis && (
            <Card className="bg-primary/5 border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-primary">
                  <Bot className="h-4 w-4" /> AI Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p><strong>Confidence:</strong> {issue.aiAnalysis.confidence}%</p>
                <p><strong>Summary:</strong> {issue.aiAnalysis.summary}</p>
                {issue.aiAnalysis.keywords && (
                  <div className="flex flex-wrap gap-1">
                    {issue.aiAnalysis.keywords.map((kw: string, i: number) => (
                      <span key={i} className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full">{kw}</span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {issue.fakeProbability > 50 && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 text-red-700">
                  <FileWarning className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">High Risk Report</h4>
                    <p className="text-xs">This report has been flagged as potentially inaccurate or duplicate by the Trust Engine.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
