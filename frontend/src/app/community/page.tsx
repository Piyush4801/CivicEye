'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, MapPin, Target, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CommunityPage() {
  const [ngos, setNgos] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ngosRes, campaignsRes] = await Promise.all([
          api.get('/ngos'),
          api.get('/campaigns')
        ]);
        setNgos(ngosRes.data);
        setCampaigns(campaignsRes.data);
      } catch (error) {
        console.error('Failed to fetch community data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleJoinCampaign = async (campaignId: string) => {
    try {
      await api.post(`/campaigns/${campaignId}/join`);
      alert('Successfully joined the campaign!');
      // Update local state to reflect join
      setCampaigns(campaigns.map(c => 
        c._id === campaignId ? { ...c, registeredVolunteers: [...c.registeredVolunteers, 'me'] } : c
      ));
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert('Please login to join campaigns.');
        router.push('/login');
      } else {
        alert(error.response?.data?.message || 'Failed to join campaign');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Civic Community Hub</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover verified NGOs, join volunteer drives, and make a real impact in your city.
        </p>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="campaigns">Volunteer Campaigns</TabsTrigger>
            <TabsTrigger value="ngos">NGO Directory</TabsTrigger>
          </TabsList>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <TabsContent value="campaigns" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => {
                  const progress = (campaign.registeredVolunteers.length / campaign.maxVolunteers) * 100;
                  return (
                    <Card key={campaign._id} className="overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={campaign.images?.[0] || 'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=800&q=80'} 
                          alt={campaign.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=800&q=80'; }}
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="bg-white/90 text-black backdrop-blur-sm">
                            {campaign.category}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-xl line-clamp-1">{campaign.title}</CardTitle>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {campaign.location?.address}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {campaign.description}
                        </p>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span>{new Date(campaign.startDate).toLocaleDateString()} at {campaign.time}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-medium">
                              <span>{campaign.registeredVolunteers.length} Volunteers</span>
                              <span>{campaign.maxVolunteers} Max</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all duration-500" 
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          className="w-full" 
                          onClick={() => handleJoinCampaign(campaign._id)}
                          disabled={campaign.status !== 'upcoming'}
                        >
                          Join Campaign
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="ngos" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                {ngos.map((ngo) => (
                  <Card key={ngo._id} className="overflow-hidden flex flex-col hover:shadow-md transition">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <img 
                          src={ngo.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(ngo.name)}&background=random&color=fff`} 
                          alt={ngo.name} 
                          className="w-16 h-16 rounded-xl object-cover border"
                          onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(ngo.name)}&background=random&color=fff`; }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-lg flex items-center gap-1">
                              {ngo.name}
                              {ngo.isVerified && <ShieldCheck className="h-4 w-4 text-blue-500" />}
                            </h3>
                            <Badge variant="outline">{ngo.areaOfWork}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {ngo.mission}
                          </p>
                          
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="bg-muted/50 p-2 rounded-lg text-center">
                              <p className="text-xs text-muted-foreground mb-1">Impact Score</p>
                              <p className="font-bold text-primary">{ngo.metrics?.impactScore}</p>
                            </div>
                            <div className="bg-muted/50 p-2 rounded-lg text-center">
                              <p className="text-xs text-muted-foreground mb-1">Projects</p>
                              <p className="font-bold">{ngo.metrics?.projectsCompleted}</p>
                            </div>
                            <div className="bg-muted/50 p-2 rounded-lg text-center">
                              <p className="text-xs text-muted-foreground mb-1">Volunteers</p>
                              <p className="font-bold">{ngo.metrics?.totalVolunteers}</p>
                            </div>
                          </div>

                          <Link href={`/community/${ngo._id}`}>
                            <Button variant="outline" className="w-full group">
                              View Full Profile <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
