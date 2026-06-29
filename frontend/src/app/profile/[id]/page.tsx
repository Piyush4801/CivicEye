'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, MapPin, Trophy, Activity, Loader2, ArrowLeft, Star, HeartHandshake, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data);
      } catch (error) {
        console.error('Failed to fetch user details', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Citizen not found</h1>
        <Link href="/rankings">
          <Button>Return to Rankings</Button>
        </Link>
      </div>
    );
  }

  // Calculate XP percentage for level progress
  const currentLevelXp = Math.pow(user.level - 1, 2) * 100;
  const nextLevelXp = Math.pow(user.level, 2) * 100;
  const xpProgress = ((user.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/rankings" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leaderboard
      </Link>

      {/* Hero Profile */}
      <div className="bg-card border rounded-2xl overflow-hidden mb-8 shadow-sm">
        <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-600 w-full relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">
              <Star className="h-4 w-4 mr-1 text-yellow-300 fill-yellow-300" /> {user.reputationScore} Reputation
            </Badge>
          </div>
          <div className="absolute -bottom-12 left-8 p-1 bg-background rounded-full">
            <img src={user.avatarUrl || 'https://i.pravatar.cc/150'} alt={user.name} className="w-28 h-28 rounded-full object-cover border-4 border-background shadow-md" />
          </div>
        </div>
        <div className="pt-16 pb-8 px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-extrabold flex items-center gap-2 mb-1 tracking-tight">
                {user.name}
                {user.level > 3 && <span title="Verified Hero"><ShieldCheck className="h-6 w-6 text-blue-500" /></span>}
              </h1>
              <p className="text-lg text-muted-foreground">Level {user.level} • Civic Contributor</p>
              
              <div className="mt-4 max-w-md">
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>{user.xp} XP</span>
                  <span>{nextLevelXp} XP (Level {user.level + 1})</span>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000" 
                    style={{ width: `${Math.max(xpProgress, 5)}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 min-w-[200px]">
              <Button className="w-full">Follow Citizen</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Badges Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" /> Earned Badges
              </CardTitle>
              <CardDescription>Digital achievements earned through civic impact.</CardDescription>
            </CardHeader>
            <CardContent>
              {user.badges && user.badges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {user.badges.map((badge: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center p-4 border rounded-xl bg-muted/20 hover:bg-muted/50 transition-colors text-center group">
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{badge.icon}</div>
                      <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        {new Date(badge.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No badges earned yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Timeline Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Impact Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
                
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-green-100 text-green-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border bg-card shadow">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm">Issue Resolved</h4>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Reported pothole was fixed by PWD.</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-100 text-blue-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border bg-card shadow">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm">Volunteered</h4>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Joined Mega Beach Cleanup Drive.</p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Civic Stats Card */}
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Civic Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-background p-3 rounded-xl border shadow-sm">
                  <div className="text-2xl font-black text-foreground mb-1">{user.stats?.issuesReported || 0}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Reported</div>
                </div>
                <div className="bg-background p-3 rounded-xl border shadow-sm">
                  <div className="text-2xl font-black text-green-600 mb-1">{user.stats?.issuesResolved || 0}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Resolved</div>
                </div>
                <div className="bg-background p-3 rounded-xl border shadow-sm col-span-2">
                  <div className="text-2xl font-black text-blue-600 mb-1">{user.stats?.volunteerHours || 0}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Volunteer Hours</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
