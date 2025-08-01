'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ReceiveCard() {
  const router = useRouter();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReceive = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!code.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a code.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch(`https://api.backend.avinash9.tech/transfer/${code.trim()}`);
      
      if (!response.ok) {
         if (response.status === 404) {
             throw new Error("Transfer Code not found or expired");
         }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check code');
      }

      router.push(`/receive/${code.trim()}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2 font-headline">Have a code?</h2>
        <p className="text-muted-foreground text-center mb-8">Enter it below to retrieve your content.</p>
        <Card className="shadow-lg">
            <CardContent className="p-6">
                <form onSubmit={handleReceive} className="flex flex-col sm:flex-row w-full items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <Input 
                    type="text" 
                    placeholder="Enter code..." 
                    className="text-base h-12 flex-1 tracking-widest" 
                    aria-label="Share code" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={isLoading}
                    maxLength={6}
                  />
                  <Button type="submit" size="lg" className="h-12 w-full sm:w-auto" disabled={isLoading || !code}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Receive
                  </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
