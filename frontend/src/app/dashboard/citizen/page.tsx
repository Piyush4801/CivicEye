'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, LogOut, Sparkles, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { motion } from 'framer-motion';

export default function CitizenDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUserStr = localStorage.getItem('user');
        if (storedUserStr) {
          const storedUser = JSON.parse(storedUserStr);
          const res = await api.get(`/users/${storedUser._id}`);
          setUser(res.data);
        } else {
          router.push('/login');
        }
      } catch (error: any) {
        console.error('Failed to fetch user', error);
        if (error.response?.status === 404 || error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="h-10 w-48 bg-muted animate-pulse rounded mb-8" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <div className="h-64 w-full bg-muted animate-pulse rounded-xl" />
            <div className="h-40 w-full bg-muted animate-pulse rounded-xl" />
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="h-32 w-full bg-muted animate-pulse rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 w-full bg-muted animate-pulse rounded-xl" />
              <div className="h-32 w-full bg-muted animate-pulse rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const currentLevelXp = Math.pow(Math.max(user.level - 1, 0), 2) * 100 || 0;
  const nextLevelXp = Math.pow(user.level || 1, 2) * 100;
  const xp = user.xp || 0;
  const xpProgress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Citizen Portal</h1>
          <p className="text-muted-foreground">Manage your civic contributions and reputation.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
          <Link href="/dashboard/citizen/raise-issue">
            <Button>
              <ShieldAlert className="mr-2 h-4 w-4" /> Report Issue
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Left Column: Profile & Gamification */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
          className="md:col-span-1 space-y-6"
        >
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy className="h-24 w-24" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4 mb-2">
                  <img src={user.avatarUrl || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-background shadow-sm" />
                  <div>
                    <CardTitle className="text-xl">{user.name || 'Citizen'}</CardTitle>
                    <CardDescription className="font-medium text-primary">Level {user.level || 1} Contributor</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>{xp} XP</span>
                      <span>{nextLevelXp} XP to Level {user.level ? user.level + 1 : 2}</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000" 
                        style={{ width: `${Math.max(xpProgress, 2)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center border-t pt-4">
                    <div>
                      <div className="text-xl font-black">{user.reputationScore || 100}</div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Reputation</div>
                    </div>
                    <div>
                      <div className="text-xl font-black text-green-600">{user.impactPoints || 0}</div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Impact Points</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recent Badges</CardTitle>
              </CardHeader>
              <CardContent>
                {user.badges && user.badges.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.badges.slice(0, 4).map((badge: any, i: number) => (
                      <div key={i} className="flex flex-col items-center p-2 bg-muted/50 rounded-lg w-[70px] text-center" title={badge.name}>
                        <span className="text-2xl mb-1">{badge.icon}</span>
                        <span className="text-[9px] font-bold leading-tight line-clamp-2">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Report issues or volunteer to earn badges!</p>
                )}
                <Link href={`/profile/${user._id}`}>
                  <Button variant="link" className="w-full mt-2 text-xs">
                    View Public Profile <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Right Column: Insights & Activity */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          className="md:col-span-2 space-y-6"
        >
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card className="bg-primary/5 border-primary/10 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-blue-700 dark:text-blue-400">
                  <Sparkles className="h-5 w-5" /> AI Civic Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Great job!</strong> Your recent reports have contributed to reducing unresolved potholes in your locality by 12% this month.
                </p>
                <p className="text-sm text-muted-foreground">
                  Based on your activity, you might be interested in the upcoming <strong>Urban Forest Plantation</strong> drive near you.
                </p>
                <Link href="/community">
                  <Button variant="outline" size="sm" className="mt-2">
                    Explore Opportunities
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Issues Reported</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl font-bold">
                    {user.stats?.issuesReported || 0}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    Issues Resolved <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="text-3xl font-bold text-success">
                    {user.stats?.issuesResolved || 0}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
