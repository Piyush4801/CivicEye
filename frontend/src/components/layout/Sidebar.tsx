'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  ShieldAlert, Home, PlusSquare, List, Activity, MapPin, Users, 
  Tent, Trophy, Newspaper, ShieldCheck, HeartHandshake, LineChart, 
  Settings, Moon, Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Raise an Issue', href: '/dashboard/citizen/raise-issue', icon: PlusSquare },
  { name: 'My Issues', href: '/dashboard/citizen', icon: List },
  { name: 'Track Progress', href: '/', icon: Activity },
  { name: 'Nearby Issues', href: '/issues', icon: MapPin },
  { name: 'Officials Directory', href: '/officials', icon: Users },
  { name: 'NGOs & Camps', href: '/community', icon: Tent },
  { name: 'Rankings', href: '/rankings', icon: Trophy },
  { name: 'News & Updates', href: '/news', icon: Newspaper },
  { name: 'Verify an Issue', href: '/verify', icon: ShieldCheck },
  { name: 'Volunteer', href: '/community', icon: HeartHandshake },
  { name: 'Analytics', href: '/analytics', icon: LineChart },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-screen sticky top-0 hidden md:flex shrink-0">
      <div className="h-16 flex items-center px-6 border-b shrink-0">
        <Link href="/" className="flex items-center space-x-2">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">CivicEye AI</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}>
                <item.icon className="h-4 w-4" />
                {item.name}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t space-y-4">
        {mounted && (
          <div className="flex items-center justify-between px-2 py-2 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span>Dark Mode</span>
            </div>
            <Switch 
              checked={theme === 'dark'} 
              onCheckedChange={(c: boolean) => setTheme(c ? 'dark' : 'light')}
            />
          </div>
        )}

        <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-4 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
             <HeartHandshake className="w-12 h-12" />
          </div>
          <h4 className="font-bold text-foreground text-sm mb-1 relative z-10">Be the change!</h4>
          <p className="text-xs text-muted-foreground mb-3 relative z-10">Your voice can build a better tomorrow.</p>
          <Link href="/dashboard/citizen/raise-issue">
            <Button size="sm" variant="outline" className="w-full text-xs font-semibold border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground relative z-10">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
