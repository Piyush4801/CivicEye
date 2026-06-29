'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, MapPin, Newspaper, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<{ issues: any[], news: any[], ngos: any[] }>({ issues: [], news: [], ngos: [] });

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        // In a real app with a proper search endpoint:
        // const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        
        // Since we don't have a dedicated search endpoint, we'll fetch all and filter client-side for realism
        const [issuesRes, newsRes, ngosRes] = await Promise.all([
          api.get('/issues'),
          api.get('/news'),
          api.get('/ngos')
        ]);

        const lowerQuery = query.toLowerCase();
        
        const filteredIssues = issuesRes.data.filter((i: any) => 
          i.title?.toLowerCase().includes(lowerQuery) || 
          i.description?.toLowerCase().includes(lowerQuery)
        );

        const filteredNews = newsRes.data.filter((n: any) => 
          n.title?.toLowerCase().includes(lowerQuery) || 
          n.content?.toLowerCase().includes(lowerQuery)
        );

        const filteredNgos = ngosRes.data.filter((ngo: any) => 
          ngo.name?.toLowerCase().includes(lowerQuery) || 
          ngo.description?.toLowerCase().includes(lowerQuery)
        );

        setResults({ issues: filteredIssues, news: filteredNews, ngos: filteredNgos });
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-full text-primary">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
          <p className="text-muted-foreground">Showing results for "{query}"</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !query ? (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p>Enter a search query in the top bar to find issues, news, or NGOs.</p>
          </CardContent>
        </Card>
      ) : results.issues.length === 0 && results.news.length === 0 && results.ngos.length === 0 ? (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p>No results found for "{query}". Try a different keyword.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          
          {/* Issues */}
          {results.issues.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Civic Issues</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {results.issues.map(issue => (
                  <Link href={`/issues/${issue._id}`} key={issue._id}>
                    <Card className="hover:border-primary/50 transition cursor-pointer h-full">
                      <CardContent className="p-4 flex gap-4">
                        <img src={issue.imageUrl} className="w-20 h-20 rounded-lg object-cover" alt="Issue" />
                        <div>
                          <h3 className="font-bold text-sm line-clamp-1">{issue.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{issue.description}</p>
                          <div className="mt-2">
                            <Badge variant={issue.severity === 'critical' ? 'destructive' : 'secondary'} className="text-[10px]">
                              {issue.severity.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* News */}
          {results.news.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Newspaper className="w-5 h-5 text-blue-500" /> News & Updates</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {results.news.map(n => (
                  <Link href="/news" key={n._id}>
                    <Card className="hover:border-blue-500/50 transition cursor-pointer h-full">
                      <CardContent className="p-4">
                        <h3 className="font-bold text-sm line-clamp-1 text-blue-600 dark:text-blue-400">{n.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{n.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* NGOs */}
          {results.ngos.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-green-500" /> NGOs & Camps</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {results.ngos.map(ngo => (
                  <Link href={`/community/${ngo._id}`} key={ngo._id}>
                    <Card className="hover:border-green-500/50 transition cursor-pointer h-full">
                      <CardContent className="p-4 flex items-center gap-4">
                        <img src={ngo.logo} className="w-12 h-12 rounded-full border object-cover" alt="NGO Logo" />
                        <div>
                          <h3 className="font-bold text-sm">{ngo.name}</h3>
                          <p className="text-xs text-muted-foreground">{ngo.areaOfWork}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary"/></div>}>
      <SearchResults />
    </Suspense>
  );
}
