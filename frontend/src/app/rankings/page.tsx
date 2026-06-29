'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp, TrendingDown, Minus, Loader2, Star, ShieldCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/lib/api';
import Link from 'next/link';

export default function RankingsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [citizens, setCitizens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const [deptRes, citRes] = await Promise.all([
          api.get('/departments/rankings'),
          api.get('/users/top')
        ]);
        setDepartments(deptRes.data);
        setCitizens(citRes.data);
      } catch (error) {
        console.error('Failed to fetch rankings', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRankings();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Accountability Rankings</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transparent leaderboards driving performance and civic responsibility across all government departments.
        </p>
      </div>

      <Tabs defaultValue="departments" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="departments">Government Departments</TabsTrigger>
            <TabsTrigger value="citizens">Top Citizens</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance Leaderboard</CardTitle>
              <CardDescription>Ranked by resolution time and citizen feedback scores.</CardDescription>
            </CardHeader>
            <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No department data available yet.</p>
              <p className="text-sm">We need to seed the database with departments.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {departments.map((dept, index) => (
                <div key={dept._id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg
                      ${index === 0 ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : 
                        index === 1 ? 'bg-slate-100 text-slate-700 border border-slate-300' : 
                        index === 2 ? 'bg-amber-100/50 text-amber-800 border border-amber-200' : 'bg-muted text-muted-foreground'}`
                    }>
                      {index === 0 ? <Trophy className="h-5 w-5" /> : `#${index + 1}`}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{dept.name}</h3>
                      <p className="text-sm text-muted-foreground">{dept.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 text-right">
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-muted-foreground">Avg. Resolution</p>
                      <p className="font-semibold">{dept.averageResolutionTimeHours} hours</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Score</p>
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-bold text-xl">{dept.performanceScore}</span>
                        {dept.performanceScore > 90 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : dept.performanceScore < 70 ? (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        ) : (
                          <Minus className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="citizens">
          <Card>
            <CardHeader>
              <CardTitle>Civic Heroes Leaderboard</CardTitle>
              <CardDescription>Citizens ranked by their community impact and reputation score.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : citizens.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No citizen data available.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {citizens.map((citizen, index) => (
                    <Link href={`/profile/${citizen._id}`} key={citizen._id}>
                      <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition cursor-pointer mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg
                            ${index === 0 ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : 
                              index === 1 ? 'bg-slate-100 text-slate-700 border border-slate-300' : 
                              index === 2 ? 'bg-amber-100/50 text-amber-800 border border-amber-200' : 'bg-muted text-muted-foreground'}`
                          }>
                            {index === 0 ? <Trophy className="h-5 w-5" /> : `#${index + 1}`}
                          </div>
                          <img src={citizen.avatarUrl || 'https://i.pravatar.cc/150'} alt={citizen.name} className="w-12 h-12 rounded-full object-cover border" />
                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              {citizen.name}
                              {citizen.level > 3 && <span title="Verified Hero"><ShieldCheck className="h-4 w-4 text-blue-500" /></span>}
                            </h3>
                            <p className="text-sm text-muted-foreground">Level {citizen.level} Contributor</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-8 text-right">
                          <div className="hidden sm:block">
                            <p className="text-sm font-medium text-muted-foreground">Impact Points</p>
                            <p className="font-semibold">{citizen.impactPoints} XP</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Reputation</p>
                            <div className="flex items-center justify-end gap-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-bold text-xl">{citizen.reputationScore}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
