'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, MapPin, Users, Target, Activity, Loader2, ArrowLeft, Mail, Phone, ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function NgoProfilePage() {
  const { ngoId } = useParams();
  const [ngo, setNgo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNgo = async () => {
      try {
        const res = await api.get(`/ngos/${ngoId}`);
        setNgo(res.data);
      } catch (error) {
        console.error('Failed to fetch NGO details', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNgo();
  }, [ngoId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!ngo) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">NGO not found</h1>
        <Link href="/community">
          <Button>Return to Community Hub</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/community" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Community Hub
      </Link>

      {/* Hero Profile */}
      <div className="bg-card border rounded-2xl overflow-hidden mb-8 shadow-sm">
        <div className="h-48 bg-gradient-to-r from-green-500/20 to-blue-500/20 w-full relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-background rounded-2xl">
            <img src={ngo.logo} alt={ngo.name} className="w-24 h-24 rounded-xl object-cover border-4 border-background shadow-md" />
          </div>
        </div>
        <div className="pt-16 pb-8 px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-extrabold flex items-center gap-2 mb-2 tracking-tight">
                {ngo.name}
                {ngo.isVerified && <ShieldCheck className="h-6 w-6 text-blue-500" />}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <Badge variant="secondary">{ngo.areaOfWork}</Badge>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {ngo.location?.address}</span>
              </div>
              <p className="text-lg max-w-3xl">{ngo.description}</p>
            </div>
            <div className="flex flex-col gap-2 min-w-[200px]">
              <Button className="w-full">Volunteer Here</Button>
              <Button variant="outline" className="w-full">Donate / Support</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Mission Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">"{ngo.mission}"</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Success Stories</CardTitle>
              <CardDescription>Recent impact and completed projects</CardDescription>
            </CardHeader>
            <CardContent>
              {ngo.successStories && ngo.successStories.length > 0 ? (
                <div className="space-y-6">
                  {ngo.successStories.map((story: any, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-4 group">
                      <img src={story.image} alt={story.title} className="w-full sm:w-48 h-32 object-cover rounded-xl border group-hover:shadow-md transition-shadow" />
                      <div>
                        <h4 className="font-bold text-lg mb-2">{story.title}</h4>
                        <p className="text-sm text-muted-foreground">{story.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No success stories published yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Metrics Card */}
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Transparency & Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Transparency Score</span>
                <span className="font-bold text-green-600">{ngo.metrics?.transparencyScore}/100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Impact Score</span>
                <span className="font-bold text-blue-600">{ngo.metrics?.impactScore}/100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Citizen Rating</span>
                <span className="font-bold">{ngo.metrics?.citizenRating} ★</span>
              </div>
              <hr />
              <div className="grid grid-cols-2 gap-4 text-center pt-2">
                <div>
                  <div className="text-2xl font-black text-foreground mb-1">{ngo.metrics?.projectsCompleted}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-foreground mb-1">{ngo.metrics?.totalVolunteers}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Volunteers</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${ngo.contactEmail}`} className="hover:text-primary transition-colors">{ngo.contactEmail}</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{ngo.contactPhone}</span>
              </div>
              {ngo.website && (
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Visit Website</a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
