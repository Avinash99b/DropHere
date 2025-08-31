import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mountain } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-2 w-fit">
                <Mountain className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground">DropHere</span>
            </Link>
            <p className="text-sm text-muted-foreground">The simplest way to share files and text across your devices.</p>
            <p className="text-sm text-muted-foreground">© {currentYear} DropHere. All rights reserved.</p>
          </div>
           <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Company</h4>
            <ul className="space-y-1">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">How It Works</Link></li>
               <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="space-y-1">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">Subscribe to our newsletter for the latest updates.</p>
            <form className="flex space-x-2">
              <Input type="email" placeholder="Enter your email" className="max-w-xs flex-1" aria-label="Email for newsletter"/>
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}