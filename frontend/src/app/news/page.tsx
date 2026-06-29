'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Bookmark, Share2, MessageCircle, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        let endpoint = '/news';
        if (activeTab !== 'all') {
          endpoint = `/news?category=${activeTab}`;
        }
        const res = await api.get(endpoint);
        setNews(res.data);
      } catch (error) {
        console.error('Failed to fetch news', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [activeTab]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Community News & Alerts</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Stay informed about government announcements, emergency alerts, and civic development projects in your area.
        </p>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full mb-8">
        <div className="flex justify-center overflow-x-auto pb-4">
          <TabsList className="inline-flex">
            <TabsTrigger value="all">Latest News</TabsTrigger>
            <TabsTrigger value="Emergency Alert" className="text-red-500 data-[state=active]:bg-red-100 data-[state=active]:text-red-700">Emergency Alerts</TabsTrigger>
            <TabsTrigger value="Development">Development</TabsTrigger>
            <TabsTrigger value="Community News">Community</TabsTrigger>
          </TabsList>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No news articles found for this category.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {news.map((item) => (
              <Card key={item._id} className={`overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 ${item.isEmergency ? 'border-red-200 shadow-red-100/50' : ''}`}>
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={item.coverImage} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80'; }}
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {item.isEmergency && (
                      <Badge variant="destructive" className="animate-pulse flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Emergency
                      </Badge>
                    )}
                    {!item.isEmergency && (
                      <Badge variant="secondary" className="bg-white/90 text-black backdrop-blur-sm">
                        {item.category}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(item.createdAt).toLocaleDateString()}</span>
                    <span className="font-medium text-primary">{item.author?.name}</span>
                  </div>
                  <CardTitle className="text-xl line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags?.map((tag: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs text-muted-foreground bg-muted/50 border-none">#{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between border-t border-muted p-4 bg-muted/20">
                  <div className="flex gap-4 text-muted-foreground">
                    <button className="flex items-center gap-1.5 text-xs hover:text-red-500 transition-colors">
                      <Heart className="h-4 w-4" /> {item.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-4 w-4" /> 12
                    </button>
                  </div>
                  <div className="flex gap-3 text-muted-foreground">
                    <button className="hover:text-primary transition-colors">
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <button className="hover:text-primary transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </Tabs>
    </div>
  );
}
