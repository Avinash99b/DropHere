import { Mountain } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-6 bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Mountain className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">DropHere</span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
            <Button asChild variant="ghost">
                <Link href="/how-it-works">How It Works</Link>
            </Button>
            <Button asChild variant="ghost">
                <Link href="/faq">FAQ</Link>
            </Button>
             <Button asChild variant="ghost">
                <Link href="/about">About Us</Link>
            </Button>
            <Button asChild>
                <Link href="/#transfer">Get Started</Link>
            </Button>
        </nav>
        <nav className="md:hidden">
            <Button asChild>
                <Link href="/#transfer">Get Started</Link>
            </Button>
        </nav>
      </div>
    </header>
  );
}