'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export default function OfficialsDirectory() {
  const [officials, setOfficials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/users?role=official')
      .then((res) => setOfficials(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Officials Directory</h1>
        <p className="text-muted-foreground">Contact details for local government officials and department heads.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : officials.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>No officials found in the directory.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {officials.map((official) => (
            <Card key={official._id} className="hover:shadow-md transition">
              <CardContent className="p-6 flex items-start gap-4">
                <img src={official.avatarUrl || `https://i.pravatar.cc/150?u=${official._id}`} alt={official.name} className="w-16 h-16 rounded-full border shadow-sm object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{official.name}</h3>
                  <p className="text-sm font-medium text-primary capitalize">{official.role}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 mb-4">
                    <MapPin className="w-3 h-3" /> {official.email}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => window.location.href=`mailto:${official.email}`}>
                      <Mail className="w-4 h-4" /> Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
