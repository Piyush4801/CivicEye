'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldAlert, Activity, CheckCircle, Clock, MapPin, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function OfficialDashboard() {
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const officialName = "Officer Sharma"; // Mocked official name
  const departmentName = "Public Works Department"; // Mocked department name

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      // In a real app, we'd fetch issues routed specifically to this official's department.
      // For now, fetch all issues.
      const res = await api.get('/issues');
      setIssues(res.data);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (issueId: string, newStatus: string) => {
    setUpdatingId(issueId);
    try {
      await api.put(`/issues/${issueId}/status`, { status: newStatus });
      // Update local state
      setIssues(issues.map(issue => 
        issue._id === issueId ? { ...issue, status: newStatus } : issue
      ));
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update issue status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingIssues = issues.filter(i => i.status !== 'completed' && i.status !== 'rejected').length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <ShieldAlert className="h-5 w-5" />
            <span className="font-semibold text-sm uppercase tracking-wider">Government Portal</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {officialName}</h1>
          <p className="text-muted-foreground">{departmentName}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingIssues}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 days</div>
            <p className="text-xs text-muted-foreground">-12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92/100</div>
            <p className="text-xs text-muted-foreground">Ranked #2 in the city</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Assigned Issues Workspace</CardTitle>
          <CardDescription>
            Review and update the status of civic issues routed to your department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center py-12">
               <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
          ) : issues.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No issues assigned to your department.</p>
          ) : (
            <div className="space-y-4">
              {issues.map((issue) => (
                <div key={issue._id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg gap-4 hover:bg-muted/30 transition">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded uppercase ${
                        issue.severity === 'critical' ? 'bg-red-100 text-red-800' : 
                        issue.severity === 'high' ? 'bg-orange-100 text-orange-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {issue.severity}
                      </span>
                      <span className="text-xs text-muted-foreground">{issue.category}</span>
                    </div>
                    <h4 className="font-semibold">{issue.title}</h4>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                      <MapPin className="h-3 w-3" /> {issue.location?.address || 'Location unknown'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <Select 
                      value={issue.status} 
                      onValueChange={(val) => handleStatusChange(issue._id, val)}
                      disabled={updatingId === issue._id}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="raised">Raised</SelectItem>
                        <SelectItem value="forwarded">Forwarded</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="repair_started">Repair Started</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {updatingId === issue._id && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
