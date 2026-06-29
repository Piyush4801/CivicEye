'use client';

import { Search, Bell, MapPin, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export function TopBar() {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Mumbai');
  const [locationQuery, setLocationQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();

  const startListening = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Your browser does not support voice input. Please try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      if (transcript.trim()) {
        router.push(`/search?q=${encodeURIComponent(transcript.trim())}`);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        alert('Microphone permission denied. Please allow microphone access to use voice input.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const searchLocation = async () => {
    if (!locationQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${encodeURIComponent(locationQuery)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (e) {
      console.error("Error fetching location:", e);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const storedUserStr = localStorage.getItem('user');
    if (storedUserStr) {
      setUser(JSON.parse(storedUserStr));
    }
  }, []);

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-40 shrink-0">
      
      {/* Search */}
      <div className="flex-1 max-w-xl relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search issues, news, officials, NGOs..." 
          className="pl-9 pr-24 bg-muted/50 border-none shadow-none focus-visible:ring-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchQuery.trim()) {
              router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            }
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            type="button"
            onClick={startListening}
            className="text-muted-foreground hover:text-primary transition-colors p-1"
            title="Use Voice Search"
          >
            <Mic className={`h-4 w-4 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
          </button>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 hidden sm:inline-flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2 text-muted-foreground outline-none border border-transparent hover:border-border">
            <MapPin className="h-4 w-4 text-primary" /> <span className="max-w-[150px] truncate">{location}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 h-[350px] flex flex-col p-0">
            <div className="p-3 border-b bg-muted/30">
              <Input 
                placeholder="Search Indian city/area..." 
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    searchLocation();
                  }
                }}
                className="h-8 text-xs mb-2"
              />
              <Button size="sm" className="w-full h-8 text-xs" onClick={(e) => { e.stopPropagation(); searchLocation(); }} disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Search Location'}
              </Button>
            </div>
            <div className="overflow-y-auto flex-1 p-1">
              {searchResults.length > 0 ? searchResults.map((loc) => (
                <DropdownMenuItem 
                  key={loc.place_id} 
                  onClick={() => {
                    const shortName = loc.display_name.split(',')[0];
                    setLocation(shortName);
                    localStorage.setItem('userLocation', JSON.stringify({ name: loc.display_name, lat: loc.lat, lon: loc.lon }));
                  }}
                  className="flex flex-col items-start cursor-pointer py-2 px-2"
                >
                  <span className="font-semibold text-sm">{loc.display_name.split(',')[0]}</span>
                  <span className="text-[10px] text-muted-foreground truncate w-full" title={loc.display_name}>{loc.display_name}</span>
                </DropdownMenuItem>
              )) : (
                <div className="p-4 text-center text-xs text-muted-foreground">Type and search to find real locations in India via OpenStreetMap.</div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 w-10 relative text-muted-foreground outline-none border border-transparent hover:border-border cursor-pointer">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-card" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-bold">Notifications</p>
            </div>
            <div className="flex flex-col max-h-[300px] overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer gap-1">
                <span className="font-semibold text-sm">Issue Verified!</span>
                <span className="text-xs text-muted-foreground">Your report "Massive Pothole" has been verified by the community.</span>
                <span className="text-[10px] text-primary mt-1">2 hours ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer gap-1 border-t">
                <span className="font-semibold text-sm">Weather Alert</span>
                <span className="text-xs text-muted-foreground">Heavy rainfall warning for Mumbai suburbs for the next 48 hours.</span>
                <span className="text-[10px] text-primary mt-1">5 hours ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer gap-1 border-t">
                <span className="font-semibold text-sm text-amber-600">Level Up!</span>
                <span className="text-xs text-muted-foreground">You reached Level 5. Keep contributing to unlock more badges.</span>
                <span className="text-[10px] text-primary mt-1">1 day ago</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 pl-2 border-l outline-none hover:bg-muted/30 p-1 pr-2 rounded-md transition cursor-pointer">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-foreground leading-none">{user ? user.name : 'Guest'}</div>
              <div className="text-[10px] text-muted-foreground mt-1 capitalize">{user ? user.role : 'Citizen'}</div>
            </div>
            <img 
              src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Guest')}&background=random&color=fff`} 
              alt="Profile" 
              className="h-9 w-9 rounded-full border shadow-sm object-cover" 
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {user ? (
              <>
                <DropdownMenuItem onClick={() => router.push(`/profile/${user._id}`)} className="cursor-pointer">
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                  }} 
                  className="cursor-pointer text-destructive"
                >
                  Logout
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => router.push('/login')} className="cursor-pointer">
                  Log In
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/register')} className="cursor-pointer">
                  Sign Up
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
