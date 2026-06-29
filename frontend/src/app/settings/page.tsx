'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { User, Lock, Bell, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'privacy'>('profile');

  // Form State
  const [name, setName] = useState('');
  const [bio, setBio] = useState('Passionate about urban cleanliness and sustainability.');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      api.get(`/users/${parsed._id}`)
        .then(res => {
          setUser(res.data);
          setName(res.data.name || '');
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Simulate API update and update local storage
    const updatedUser = { ...user, name };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast.success('Profile settings saved successfully!');
    // Reload page to reflect changes in TopBar natively (or let user navigate away)
    setTimeout(() => {
      window.dispatchEvent(new Event("storage"));
    }, 500);
  };

  const handleGenericSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Preferences updated successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[calc(100vh-4rem)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile, preferences, and security.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* SIDEBAR */}
        <div className="md:col-span-1 space-y-2">
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab('profile')}
            className={`w-full justify-start ${activeTab === 'profile' ? 'font-bold bg-muted text-primary' : 'text-muted-foreground'}`}
          >
            <User className="w-4 h-4 mr-2" /> Profile
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab('security')}
            className={`w-full justify-start ${activeTab === 'security' ? 'font-bold bg-muted text-primary' : 'text-muted-foreground'}`}
          >
            <Lock className="w-4 h-4 mr-2" /> Security
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab('notifications')}
            className={`w-full justify-start ${activeTab === 'notifications' ? 'font-bold bg-muted text-primary' : 'text-muted-foreground'}`}
          >
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab('privacy')}
            className={`w-full justify-start ${activeTab === 'privacy' ? 'font-bold bg-muted text-primary' : 'text-muted-foreground'}`}
          >
            <ShieldCheck className="w-4 h-4 mr-2" /> Privacy
          </Button>
        </div>

        {/* CONTENT AREA */}
        <div className="md:col-span-3 space-y-6">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : !user ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Please log in to manage your settings.
              </CardContent>
            </Card>
          ) : (
            <>
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <Card className="animate-in fade-in zoom-in-95 duration-200">
                  <CardHeader>
                    <CardTitle>Public Profile</CardTitle>
                    <CardDescription>This information will be displayed on your public profile and leaderboards.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`} alt="Avatar" className="w-20 h-20 rounded-full border shadow-sm object-cover" />
                        <Button variant="outline" type="button">Change Avatar</Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={user.email} disabled />
                        <p className="text-xs text-muted-foreground">Your email is tied to your account and cannot be changed.</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Bio</Label>
                        <Input value={bio} onChange={(e) => setBio(e.target.value)} />
                      </div>
                      <div className="pt-4 border-t">
                        <Button type="submit">Save Profile</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                <Card className="animate-in fade-in zoom-in-95 duration-200">
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage your password and account security settings.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleGenericSave} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Current Password</Label>
                        <Input type="password" placeholder="••••••••" required />
                      </div>
                      <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input type="password" placeholder="••••••••" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Confirm New Password</Label>
                        <Input type="password" placeholder="••••••••" required />
                      </div>
                      <div className="pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="pt-4 border-t mt-4">
                        <Button type="submit">Update Security Settings</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <Card className="animate-in fade-in zoom-in-95 duration-200">
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Choose what updates you want to receive and how.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleGenericSave} className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-xs text-muted-foreground">Receive weekly digests and major platform updates.</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Issue Status Updates</Label>
                          <p className="text-xs text-muted-foreground">Get instantly notified when your reported issue changes status.</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Local Alerts</Label>
                          <p className="text-xs text-muted-foreground">Receive critical emergency or weather alerts in your area.</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="pt-4 border-t">
                        <Button type="submit">Save Preferences</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* PRIVACY TAB */}
              {activeTab === 'privacy' && (
                <Card className="animate-in fade-in zoom-in-95 duration-200">
                  <CardHeader>
                    <CardTitle>Privacy</CardTitle>
                    <CardDescription>Control your data visibility and public profile.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleGenericSave} className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Public Profile Visibility</Label>
                          <p className="text-xs text-muted-foreground">Allow your profile to appear on the Top Citizens leaderboard.</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Anonymous Reporting</Label>
                          <p className="text-xs text-muted-foreground">Hide your identity on issues you report by default.</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="pt-4 border-t">
                        <Button type="submit">Save Privacy Settings</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
