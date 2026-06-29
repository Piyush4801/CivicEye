'use client';

import { RaiseIssueForm } from '@/components/forms/RaiseIssueForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RaiseIssuePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Report an Issue</h1>
        <p className="text-muted-foreground">Help your community by reporting local issues. Our AI will analyze your report and route it to the right department.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
          <CardDescription>Please provide as much information as possible.</CardDescription>
        </CardHeader>
        <CardContent>
          <RaiseIssueForm />
        </CardContent>
      </Card>
    </div>
  );
}
