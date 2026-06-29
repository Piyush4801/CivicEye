'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, MapPin, CheckCircle, Users, Activity,
  ArrowRight, Phone, Mail, Star, Trophy, ThumbsUp, Camera, Cctv, Satellite, ShieldCheck, Heart, PlusSquare, Info, ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import api from '@/lib/api';

const IssueMap = dynamic(() => import('@/components/map/IssueMap'), {
  ssr: false,
});

export default function DashboardPage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [ngos, setNgos] = useState<any[]>([]);
  const [officials, setOfficials] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [rankings, setRankings] = useState<any[]>([]);
  const [trackId, setTrackId] = useState('');
  const router = useRouter();

  useEffect(() => {
    api.get('/issues').then((res) => setIssues(res.data)).catch(console.error);
    api.get('/news').then((res) => setNews(res.data)).catch(console.error);
    api.get('/ngos').then((res) => setNgos(res.data)).catch(console.error);
    api.get('/users?role=official').then((res) => setOfficials(res.data)).catch(console.error);
    api.get('/users/top').then((res) => setTopUsers(res.data)).catch(console.error);
    api.get('/departments/rankings').then((res) => setRankings(res.data)).catch(console.error);
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto pb-20">
      
      {/* 1. HERO SECTION */}
      <div className="relative w-full min-h-[350px] rounded-2xl overflow-hidden bg-slate-900 flex flex-col justify-between p-8 gap-8">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2000&auto=format&fit=crop" 
          alt="City Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
        />
        
        <div className="relative z-20 max-w-lg mt-4">
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
            Building better <br/><span className="text-blue-400">communities</span> together
          </h1>
          <p className="text-slate-300 mb-6 text-sm">
            Report issues, track progress, connect with officials and NGOs, and make a real impact in your city.
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard/citizen/raise-issue">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg shadow-blue-900/20">
                <PlusSquare className="w-4 h-4 mr-2" /> Raise an Issue
              </Button>
            </Link>
            <Link href="#verify-section">
              <Button variant="outline" className="bg-transparent text-white border-slate-600 hover:bg-slate-800 hover:text-white">
                <Info className="w-4 h-4 mr-2" /> How it Works
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="relative z-20 grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto pt-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 backdrop-blur"><Activity className="w-5 h-5"/></div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Issues Raised</div>
              <div className="text-xl font-bold text-white">12,548</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg text-green-400 backdrop-blur"><CheckCircle className="w-5 h-5"/></div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Issues Resolved</div>
              <div className="text-xl font-bold text-white">8,932</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 backdrop-blur"><Users className="w-5 h-5"/></div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Citizens</div>
              <div className="text-xl font-bold text-white">5,120</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400 backdrop-blur"><Building2 className="w-5 h-5"/></div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Communities</div>
              <div className="text-xl font-bold text-white">320</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. QUICK ACTIONS & MAP ROW */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column: Quick Actions + Progress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Raise Issue Widget */}
            <Card className="shadow-sm border-border hover:shadow-md transition overflow-hidden relative group">
              <CardContent className="p-6">
                <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
                  <MapPin className="w-48 h-48" />
                </div>
                <h3 className="text-lg font-bold mb-2">Raise an Issue</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-[200px]">Report civic problems in your area to get them fixed.</p>
                <Link href="/dashboard/citizen/raise-issue">
                  <Button className="bg-primary text-primary-foreground shadow-sm">Raise Now</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Track Issue Widget */}
            <Card className="shadow-sm border-border hover:shadow-md transition">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Track Your Issue</h3>
                <p className="text-sm text-muted-foreground mb-6">Track the progress of your reported issues in real-time</p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter Issue ID" 
                    className="bg-background shadow-inner" 
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && trackId.trim()) router.push(`/issues/${trackId.trim()}`);
                    }}
                  />
                  <Button 
                    size="icon" 
                    className="shrink-0"
                    onClick={() => {
                      if (trackId.trim()) router.push(`/issues/${trackId.trim()}`);
                      else toast.error("Please enter an Issue ID");
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Issue Progress */}
          {issues.length > 0 && (
            <Card className="shadow-sm border-border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold">Latest Issue Progress</CardTitle>
                <Link href="/issues" className="text-xs font-semibold text-primary hover:underline flex items-center">
                  View All <ArrowRight className="w-3 h-3 ml-1"/>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-8">
                  <img src={issues[0].images?.[0] || issues[0].imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=100&q=80'} alt={issues[0].title} className="w-12 h-12 rounded-lg object-cover border" />
                  <div>
                    <h4 className="font-bold text-sm">{issues[0].title}</h4>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span>Issue ID: {issues[0]._id.substring(0, 8)}</span>
                      <Badge variant="destructive" className="h-4 text-[9px] px-1 bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
                        {issues[0].severity}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Custom Stepper */}
                <div className="relative px-2">
                  <div className="absolute top-2 left-6 right-6 h-0.5 bg-muted z-0" />
                  <div className={`absolute top-2 left-6 h-0.5 bg-green-500 z-0 transition-all ${
                    issues[0].status === 'resolved' ? 'w-full' : 
                    issues[0].status === 'in_progress' ? 'w-[75%]' : 
                    issues[0].status === 'forwarded' ? 'w-[50%]' : 'w-[25%]'
                  }`} />
                  
                  <div className="flex justify-between relative z-10 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 mb-2 border-[3px] border-card shadow-sm" />
                      <span className="text-[10px] font-bold text-foreground">Raised</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full mb-2 border-[3px] border-card shadow-sm ${
                        ['forwarded', 'in_progress', 'resolved'].includes(issues[0].status) ? 'bg-green-500' : 'bg-muted border-muted-foreground/30'
                      }`} />
                      <span className="text-[10px] font-bold text-foreground">Verified</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full mb-2 border-[3px] border-card shadow-sm ${
                        ['forwarded', 'in_progress', 'resolved'].includes(issues[0].status) ? 'bg-green-500' : 'bg-muted border-muted-foreground/30'
                      }`} />
                      <span className="text-[10px] font-bold text-foreground">Assigned</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full mb-2 border-[3px] border-card shadow-sm ${
                        ['in_progress', 'resolved'].includes(issues[0].status) ? 'bg-amber-400' : 'bg-muted border-muted-foreground/30'
                      }`} />
                      <span className="text-[10px] font-bold text-foreground">In Progress</span>
                    </div>
                    <div className={`flex flex-col items-center ${issues[0].status === 'resolved' ? '' : 'opacity-50'}`}>
                      <div className={`w-4 h-4 rounded-full mb-2 border-[3px] border-card shadow-sm ${
                        issues[0].status === 'resolved' ? 'bg-green-500' : 'bg-muted border-muted-foreground/30'
                      }`} />
                      <span className="text-[10px] font-bold text-foreground">Resolved</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between bg-muted/30 p-3 rounded-lg border border-border/50 text-xs">
                  <span className="text-muted-foreground">Current Status: <strong className="text-foreground capitalize">{issues[0].status.replace('_', ' ')}</strong></span>
                  <Link href={`/issues/${issues[0]._id}`}>
                    <Button size="sm" className="h-7 text-xs font-semibold px-3 shadow-sm">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Live Map */}
        <Card className="shadow-sm border-border flex flex-col overflow-hidden lg:h-full min-h-[400px]">
          <CardHeader className="pb-3 border-b bg-card z-10 shrink-0">
            <CardTitle className="text-base font-bold">Live Map Overview</CardTitle>
          </CardHeader>
          <div className="flex-1 relative z-0 bg-slate-100 dark:bg-slate-900">
             <IssueMap issues={issues} />
          </div>
        </Card>

      </div>

      {/* 3. INFORMATION GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Officials Near You */}
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-base font-bold">Officials Near You</CardTitle>
            <Link href="#" className="text-xs font-semibold text-primary hover:underline">View All &gt;</Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {officials.length > 0 ? officials.slice(0, 3).map((official, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 transition">
                  <div className="flex items-center gap-3">
                    <img src={official.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(official.name)}&background=random&color=fff`} className="w-10 h-10 rounded-full border shadow-sm" alt={official.name} />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{i + 1}. {official.name}</h4>
                      <p className="text-[10px] text-muted-foreground capitalize">{official.role}</p>
                      <p className="text-[10px] text-muted-foreground">{official.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-muted-foreground">
                    <a href={`tel:${official.contactPhone || ''}`} className="p-1.5 hover:bg-muted hover:text-foreground rounded"><Phone className="w-4 h-4"/></a>
                    <a href={`mailto:${official.email}`} className="p-1.5 hover:bg-muted hover:text-foreground rounded"><Mail className="w-4 h-4"/></a>
                  </div>
                </div>
              )) : (
                <div className="p-4 text-center text-xs text-muted-foreground">No officials found in your zone.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Send Complaint To */}
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-base font-bold">Send Complaint To</CardTitle>
            <CardDescription className="text-xs">Select departments to forward this issue</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {[
              { id: 'bbmp', label: 'Bruhat Bengaluru Mahanagara Palike (BBMP)', checked: true },
              { id: 'bwssb', label: 'Bangalore Water Supply & Sewerage Board', checked: false },
              { id: 'bescom', label: 'BESCOM - Electricity Department', checked: false },
              { id: 'bda', label: 'Bangalore Development Authority (BDA)', checked: false },
              { id: 'traffic', label: 'Traffic Police Department', checked: false },
            ].map((dept) => (
              <div key={dept.id} className="flex items-start space-x-3">
                <input type="checkbox" id={dept.id} defaultChecked={dept.checked} className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" />
                <label htmlFor={dept.id} className="text-xs font-medium leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 dark:text-slate-300">
                  {dept.label}
                </label>
              </div>
            ))}
            <Button 
              className="w-full mt-2 shadow-sm font-semibold"
              onClick={() => toast.success("Complaint successfully forwarded to selected departments!")}
            >
              Send Complaint
            </Button>
          </CardContent>
        </Card>

        {/* News & Updates */}
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-base font-bold">News & Updates</CardTitle>
            <Link href="/news" className="text-xs font-semibold text-primary hover:underline">View All &gt;</Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {news.length > 0 ? news.slice(0, 3).map((n, i) => (
                <Link href="/news" key={i}>
                  <div className="flex items-center gap-4 p-4 hover:bg-muted/30 transition cursor-pointer">
                    <img 
                      src={n.coverImage || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=100&q=80'} 
                      className="w-14 h-14 rounded-lg object-cover shadow-sm border border-border" 
                      alt={n.title} 
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=100&q=80'; }}
                    />
                    <div>
                      <h4 className="text-xs font-bold leading-tight mb-1 text-foreground line-clamp-2">{n.title}</h4>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        {new Date(n.createdAt).toLocaleDateString()} • 
                        <Badge variant="outline" className="text-[8px] h-3 px-1 py-0">{n.author.role === 'Government' || n.author.role === 'Official' ? 'Official' : 'Independent'}</Badge> 
                        {n.author.name}
                      </p>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="p-4 text-center text-xs text-muted-foreground">No recent news.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* NGOs & Social Camps */}
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-base font-bold">NGOs & Social Camps</CardTitle>
            <Link href="/community" className="text-xs font-semibold text-primary hover:underline">View All &gt;</Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {ngos.length > 0 ? ngos.slice(0, 3).map((ngo, i) => (
                <Link href={`/community/${ngo._id}`} key={i}>
                  <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition cursor-pointer">
                    <div className="flex items-center gap-3">
                      <img src={ngo.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(ngo.name)}&background=random&color=fff`} className="w-10 h-10 rounded-full border shadow-sm" alt={ngo.name} />
                      <div>
                        <h4 className="text-xs font-bold text-foreground">{ngo.name}</h4>
                        <p className="text-[10px] text-muted-foreground">{ngo.areaOfWork || ngo.mission}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-current"/> {ngo.metrics?.citizenRating || 'New'}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs text-primary border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toast.success(`You requested to join ${ngo.name}!`);
                        }}
                      >
                        Join
                      </Button>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="p-4 text-center text-xs text-muted-foreground">No NGOs active in your zone.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Contributors */}
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-base font-bold">Top Contributors This Month</CardTitle>
            <Link href="/rankings" className="text-xs font-semibold text-primary hover:underline">View All &gt;</Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {topUsers.length > 0 ? topUsers.slice(0, 4).map((user, i) => (
                <Link href={`/profile/${user._id}`} key={i}>
                  <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`font-black text-sm w-4 text-center ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-700' : 'text-muted-foreground'}`}>
                        {i <= 2 ? <Trophy className="w-4 h-4 mx-auto" /> : i + 1}
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`} className="w-8 h-8 rounded-full border shadow-sm" alt={user.name} />
                        <h4 className="text-xs font-medium text-foreground">{user.name}</h4>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-muted-foreground">{user.xp || user.impactPoints} Points</div>
                  </div>
                </Link>
              )) : (
                <div className="p-4 text-center text-xs text-muted-foreground">Leaderboard is empty.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Unified Rankings Grid */}
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold">Overall Rankings</CardTitle>
            <Link href="/rankings" className="text-xs font-semibold text-primary hover:underline">View All &gt;</Link>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Top Departments */}
              {rankings.length > 0 && rankings.slice(0, 3).map((dept, i) => (
                <Link href={`/rankings`} key={`dept-${i}`} className="block">
                  <div className="flex items-center justify-between bg-muted/10 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition cursor-pointer">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(dept.name)}&background=random&color=fff`} className="w-8 h-8 rounded-md border shadow-sm object-cover" alt={dept.name} />
                      <div>
                        <h4 className="text-xs font-bold text-foreground line-clamp-1">{dept.name}</h4>
                        <p className="text-[10px] text-muted-foreground">Govt Dept • Score: {dept.performanceScore || 'N/A'}/100</p>
                      </div>
                    </div>
                    <div className="flex hidden sm:flex">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-3 h-3 ${j < (dept.performanceScore / 20) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
              
              {/* Top NGOs */}
              {ngos.length > 0 && ngos.slice(0, 2).map((ngo, i) => (
                <Link href={`/community/${ngo._id}`} key={`ngo-${i}`} className="block">
                  <div className="flex items-center justify-between bg-muted/10 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition cursor-pointer">
                    <div className="flex items-center gap-3">
                      <img src={ngo.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(ngo.name)}&background=random&color=fff`} className="w-8 h-8 rounded-md border shadow-sm object-cover" alt={ngo.name} />
                      <div>
                        <h4 className="text-xs font-bold text-foreground line-clamp-1">{ngo.name}</h4>
                        <p className="text-[10px] text-muted-foreground">NGO • Rating: {ngo.metrics?.citizenRating || 'N/A'}/5</p>
                      </div>
                    </div>
                    <div className="flex hidden sm:flex">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-3 h-3 ${j < Math.round(ngo.metrics?.citizenRating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
              
              {rankings.length === 0 && ngos.length === 0 && (
                <div className="p-4 text-center text-xs text-muted-foreground">No rankings available yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. VERIFY ISSUE SECTION */}
      <Card id="verify-section" className="shadow-sm border-border bg-gradient-to-br from-card to-muted/20 scroll-mt-24">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Verify an Issue (Ensure Genuineness)</CardTitle>
              <CardDescription className="text-xs mt-1">Our 4-step multi-layered verification process</CardDescription>
            </div>
            <Link href="/verify" className="text-xs font-semibold text-blue-500 hover:underline">View Verification Queue</Link>
          </div>
        </CardHeader>
        <CardContent className="relative mt-4 mb-4">
          <div className="hidden md:block absolute top-1/2 left-8 right-8 h-0.5 bg-border -z-10 -translate-y-[10px]"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-background p-5 rounded-xl shadow-sm border border-border relative group hover:border-primary/50 transition flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mb-3 shadow-sm border border-white">1</div>
              <h4 className="font-bold text-sm mb-1">Community Voting</h4>
              <p className="text-[10px] text-muted-foreground mb-4">Citizens upvote or downvote issues in their locality.</p>
              <Link href="/verify">
                <Button size="sm" variant="outline" className="h-7 text-[10px] text-primary border-primary/20 shadow-sm w-full">Vote Now</Button>
              </Link>
            </div>

            <div className="bg-background p-5 rounded-xl shadow-sm border border-border relative group hover:border-primary/50 transition flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mb-3 shadow-sm border border-white">2</div>
              <h4 className="font-bold text-sm mb-1">Site Images</h4>
              <p className="text-[10px] text-muted-foreground mb-4">Upload additional images after reporter approval.</p>
              <Link href="/issues">
                <Button size="sm" variant="outline" className="h-7 text-[10px] text-primary border-primary/20 shadow-sm w-full">Upload</Button>
              </Link>
            </div>

            <div className="bg-background p-5 rounded-xl shadow-sm border border-border relative group hover:border-primary/50 transition flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm mb-3 shadow-sm border border-white">3</div>
              <h4 className="font-bold text-sm mb-1">Local Surveillance</h4>
              <p className="text-[10px] text-muted-foreground mb-4">Raise a query for nearby CCTVs or volunteers.</p>
              <Link href="/verify">
                <Button size="sm" variant="outline" className="h-7 text-[10px] text-primary border-primary/20 shadow-sm w-full">Request</Button>
              </Link>
            </div>

            <div className="bg-background p-5 rounded-xl shadow-sm border border-border relative group hover:border-primary/50 transition flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm mb-3 shadow-sm border border-white">4</div>
              <h4 className="font-bold text-sm mb-1">AI Satellite Check</h4>
              <p className="text-[10px] text-muted-foreground mb-4">AI analyzes recent satellite imagery for major issues.</p>
              <a href="https://maps.google.com/?q=Mumbai" target="_blank" rel="noopener noreferrer" className="w-full">
                <Button size="sm" variant="outline" className="h-7 text-[10px] text-primary border-primary/20 shadow-sm w-full">Analyze</Button>
              </a>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* 5. FOOTER CTA */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#0A192F] p-8 flex flex-col md:flex-row items-center justify-between shadow-xl">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">Together, we can build a better tomorrow</h2>
          <p className="text-sm text-slate-400">Your small step today can bring big changes in your community.</p>
        </div>
        <div className="relative z-10 mt-6 md:mt-0 flex gap-4 items-center">
          <Link href="/community">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg px-8">Get Involved</Button>
          </Link>
        </div>
        <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80" alt="People" className="absolute right-0 bottom-0 h-full w-1/3 object-cover opacity-30 mix-blend-screen" />
      </div>

      {/* STANDARD FOOTER */}
      <footer className="pt-12 pb-6 border-t mt-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight text-primary">CivicEye AI</span>
          </Link>
          <p className="text-xs text-muted-foreground max-w-[200px]">
            AI-Powered Civic Engagement for a Better Society
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-sm mb-4">Platform</h4>
          <ul className="space-y-3 text-xs text-muted-foreground">
            <li><Link href="/dashboard/citizen/raise-issue" className="hover:text-primary">Raise an Issue</Link></li>
            <li><Link href="/" className="hover:text-primary">Track Progress</Link></li>
            <li><Link href="/verify" className="hover:text-primary">Verify an Issue</Link></li>
            <li><Link href="/rankings" className="hover:text-primary">Rankings</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-sm mb-4">Community</h4>
          <ul className="space-y-3 text-xs text-muted-foreground">
            <li><Link href="/community" className="hover:text-primary">NGOs & Camps</Link></li>
            <li><Link href="/community" className="hover:text-primary">Volunteer</Link></li>
            <li><Link href="/news" className="hover:text-primary">News & Updates</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm mb-4">Legal & Support</h4>
          <ul className="space-y-3 text-xs text-muted-foreground">
            <li><Link href="#" className="hover:text-primary">Help Center</Link></li>
            <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-primary">Terms of Use</Link></li>
            <li><Link href="#" className="hover:text-primary">Report Bug</Link></li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-5 text-center pt-8 border-t text-[10px] text-muted-foreground flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 CivicEye AI. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">Made with <Heart className="w-3 h-3 text-red-500 fill-red-500"/> for better communities</p>
        </div>
      </footer>

    </div>
  );
}
