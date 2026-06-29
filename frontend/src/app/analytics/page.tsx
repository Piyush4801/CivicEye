'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, AlertOctagon, CheckCircle2, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function AnalyticsPage() {
  const [stats, setStats] = useState({ total: 0, resolved: 0, resolutionRate: '0.0' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/issues')
      .then((res) => {
        const issues = res.data;
        const total = issues.length;
        const resolved = issues.filter((i: any) => i.status === 'resolved' || i.status === 'completed').length;
        const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : '0.0';
        setStats({ total, resolved, resolutionRate });
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">City Analytics</h1>
        <p className="text-muted-foreground">AI-driven insights into civic performance and issue resolution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="p-6">
            <Activity className="w-8 h-8 text-blue-500 mb-2" />
            <h3 className="text-sm font-semibold text-muted-foreground">Total Issues</h3>
            <p className="text-3xl font-black text-blue-700">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin mt-2" /> : stats.total}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardContent className="p-6">
            <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
            <h3 className="text-sm font-semibold text-muted-foreground">Resolution Rate</h3>
            <p className="text-3xl font-black text-green-700">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin mt-2" /> : `${stats.resolutionRate}%`}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-50/50 border-red-100">
          <CardContent className="p-6">
            <AlertOctagon className="w-8 h-8 text-red-500 mb-2" />
            <h3 className="text-sm font-semibold text-muted-foreground">Total Resolved</h3>
            <p className="text-3xl font-black text-red-700">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin mt-2" /> : stats.resolved}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50/50 border-purple-100">
          <CardContent className="p-6">
            <TrendingUp className="w-8 h-8 text-purple-500 mb-2" />
            <h3 className="text-sm font-semibold text-muted-foreground">Civic Engagement</h3>
            <p className="text-3xl font-black text-purple-700">+42%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center border-dashed bg-muted/30">
        <div className="text-center text-muted-foreground">
          <Activity className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-bold">Interactive Charts Locked</h3>
          <p className="text-sm">Connect a BI tool or real-time dataset to render historical charts.</p>
        </div>
      </Card>
    </div>
  );
}
