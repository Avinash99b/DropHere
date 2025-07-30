'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, FileText, Type, Copy, Check, Loader2 } from 'lucide-react';
import FileUpload from './file-upload';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Peer, DataConnection } from 'peerjs';

export default function SendCard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [transferState, setTransferState] = useState('');

  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  
  // Dynamically import peerjs
  const PeerJs = (() => {
    if (typeof window !== 'undefined') {
        return require('peerjs').default;
    }
    return null;
  })();

  useEffect(() => {
    return () => {
      // Cleanup peer connection on component unmount
      if (connRef.current) {
        connRef.current.close();
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, []);

  const handleFileTransfer = async () => {
    if (!file || !PeerJs) {
        toast({
            title: 'No file selected',
            description: 'Please select a file to send.',
            variant: 'destructive',
        });
        return;
    }

    setIsLoading(true);
    setTransferState('Initializing connection...');

    const peer = new PeerJs();
    peerRef.current = peer;

    peer.on('open', async (id) => {
        setTransferState('Connection open. Generating code...');
        try {
            const response = await fetch('https://api.backend.avinash9.tech/transfer/file/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sender_peer_id: id }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to get transfer code');
            }
            setGeneratedCode(result.receivingCode.toString());
            setIsLoading(false); // Code is generated, stop primary loading
            setTransferState('Waiting for receiver...');
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            setIsLoading(false);
            setTransferState('');
        }
    });

    peer.on('connection', (conn) => {
        connRef.current = conn;
        setTransferState('Receiver connected! Sending file...');
        
        conn.on('open', () => {
            const fileData = {
              file: file,
              filename: file.name,
              filetype: file.type,
            };
            conn.send(fileData);
        });

        conn.on('data', (data) => {
            // Handle confirmation from receiver
            if(data === 'received') {
                setTransferState('File sent successfully!');
                toast({
                    title: 'Success',
                    description: 'Your file has been sent.',
                });
                setTimeout(() => {
                    setGeneratedCode(null);
                    setTransferState('');
                }, 3000)
            }
        })
    });

    peer.on('error', (err) => {
        toast({
            title: 'Connection Error',
            description: err.message,
            variant: 'destructive',
        });
        setIsLoading(false);
        setTransferState('Error. Please try again.');
    });
  };

  const handleTextSend = async () => {
     if (!text) {
        toast({
            title: 'Nothing to send',
            description: 'Please enter some text.',
            variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setGeneratedCode(null);

      try {
        const response = await fetch('https://api.backend.avinash9.tech/transfer/text/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: btoa(text) }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to send');
        }

        setGeneratedCode(result.receivingCode.toString());
        
    } catch (error: any) {
        toast({
            title: 'Error',
            description: error.message || 'An unexpected error occurred.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (activeTab === 'text') {
        await handleTextSend();
    } else {
        await handleFileTransfer();
    }
  };

  const copyToClipboard = () => {
    if (generatedCode) {
        navigator.clipboard.writeText(generatedCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
         toast({
            title: 'Copied!',
            description: 'The code has been copied to your clipboard.',
        });
    }
  };

  const resetState = () => {
      setGeneratedCode(null);
      setFile(null);
      setText('');
      setTransferState('');
      if (connRef.current) connRef.current.close();
      if (peerRef.current) peerRef.current.destroy();
  }

  if (generatedCode) {
    return (
        <div className="w-full max-w-2xl mx-auto">
             <h2 className="text-3xl font-bold text-center mb-8 font-headline">Your Code is Ready!</h2>
            <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">Use this code to receive your content on any device:</p>
                    <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg bg-muted/50">
                        <span className="text-3xl font-bold tracking-widest text-primary">{generatedCode}</span>
                        <Button onClick={copyToClipboard} size="icon" variant="ghost" aria-label="Copy code">
                           {isCopied ? <Check className="text-green-500" /> : <Copy />}
                        </Button>
                    </div>
                    {activeTab === 'file' && transferState && (
                        <div className="mt-4 text-center">
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin"/>
                                {transferState}
                            </p>
                        </div>
                    )}
                    <Button onClick={resetState} className="mt-6 w-full" variant="outline">Share something else</Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 font-headline">Start Sharing</h2>
        <Card className="shadow-lg">
            <CardContent className="p-6">
                 <p className="text-muted-foreground text-center mb-8">Choose whether to send text or a file.</p>
                <Tabs defaultValue="text" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 rounded-lg">
                    <TabsTrigger value="text" className="py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-md rounded-md">
                        <Type className="mr-2 h-4 w-4" />
                        Text
                    </TabsTrigger>
                    <TabsTrigger value="file" className="py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-md rounded-md">
                        <FileText className="mr-2 h-4 w-4" />
                        File
                    </TabsTrigger>
                </TabsList>
                <form onSubmit={handleSubmit}>
                    <TabsContent value="text" className="mt-6">
                        <div className="space-y-4">
                        <Textarea
                            placeholder="Type your message here."
                            className="min-h-[150px] text-base"
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value);
                                setFile(null);
                            }}
                            aria-label="Text to send"
                            disabled={isLoading}
                        />
                        <Button className="w-full" size="lg" type="submit" disabled={isLoading || !text}>
                            <Send className="mr-2 h-4 w-4" /> {isLoading ? 'Sending...' : 'Send Text'}
                        </Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="file" className="mt-6">
                        <div className="space-y-4">
                            <FileUpload onFileSelect={(selectedFile) => {
                                setFile(selectedFile);
                                setText('');
                            }}/>
                            <Button className="w-full" size="lg" type="submit" disabled={isLoading || !file}>
                                <Send className="mr-2 h-4 w-4" /> {isLoading ? 'Getting Code...' : 'Send File'}
                            </Button>
                        </div>
                    </TabsContent>
                </form>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
