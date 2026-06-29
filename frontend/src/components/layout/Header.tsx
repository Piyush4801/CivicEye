import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight text-primary">CivicEye AI</span>
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/issues" className="text-sm font-medium hover:text-primary transition-colors">
            Explore Issues
          </Link>
          <Link href="/community" className="text-sm font-medium hover:text-primary transition-colors">
            Community
          </Link>
          <Link href="/rankings" className="text-sm font-medium hover:text-primary transition-colors">
            Rankings
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
