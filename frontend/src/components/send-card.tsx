'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, FileText, Type, Copy, Check, Loader2, X, Calendar as CalendarIcon, Info } from 'lucide-react';
import FileUpload from './file-upload';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Peer, DataConnection } from 'peerjs';
import JSZip from 'jszip';
import { Progress } from './ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { format, add, formatDistanceToNowStrict } from 'date-fns';


const CHUNK_SIZE = 64 * 1024; // 64KB

export default function SendCard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [transferState, setTransferState] = useState('');
  const [sentSize, setSentSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);

  const [expiresAt, setExpiresAt] = useState<Date | undefined>();
  const [time, setTime] = useState('23:59');
  const [expiresIn, setExpiresIn] = useState<string | null>(null);

  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  
  const PeerJs = (() => {
    if (typeof window !== 'undefined') {
        return require('peerjs').default;
    }
    return null;
  })();

  const cleanupPeer = useCallback(() => {
    if (connRef.current) {
        connRef.current.close();
    }
    if (peerRef.current) {
        peerRef.current.destroy();
    }
    connRef.current = null;
    peerRef.current = null;
  }, []);

  const resetState = useCallback(() => {
      cleanupPeer();
      setGeneratedCode(null);
      setFiles(null);
      setText('');
      setTransferState('');
      setIsLoading(false);
      setSentSize(0);
      setTotalSize(0);
      setExpiresAt(undefined);
      setExpiresIn(null);
  }, [cleanupPeer]);

  useEffect(() => {
    return () => {
      cleanupPeer();
    };
  }, [cleanupPeer]);

  useEffect(() => {
    if (expiresAt) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDate = new Date(expiresAt.getFullYear(), expiresAt.getMonth(), expiresAt.getDate(), hours, minutes);
      
      if(newDate > new Date()) {
        const readableTime = formatDistanceToNowStrict(newDate, { addSuffix: true });
        setExpiresIn(`Expires ${readableTime}`);
      } else {
        setExpiresIn("Date must be in the future");
      }
    } else {
        setExpiresIn(null);
    }
  }, [expiresAt, time]);

  const handleFileTransfer = async () => {
    if (!files || files.length === 0 || !PeerJs) {
        toast({
            title: 'No file selected',
            description: 'Please select one or more files to send.',
            variant: 'destructive',
        });
        return;
    }

    setIsLoading(true);
    setTransferState('Preparing files...');

    let fileToSend: File;
    let isZipped = false;

    if (files.length > 1) {
        const zip = new JSZip();
        Array.from(files).forEach(file => {
            zip.file(file.name, file);
        });
        const zipBlob = await zip.generateAsync({type:"blob", compression: "DEFLATE"});
        fileToSend = new File([zipBlob], 'compressed.zip', { type: 'application/zip' });
        isZipped = true;
    } else {
        fileToSend = files[0];
    }
    
    setTotalSize(fileToSend.size);
    setSentSize(0);
    setTransferState('Initializing connection...');

    cleanupPeer();
    const peer = new PeerJs({
        config: {
            iceServers: [
                {
                    urls: 'turn:turn.drophere.in',
                    username: 'testuser',
                    credential: 'testpass'
                }
            ]
        }
    });
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
            setIsLoading(false); 
            setTransferState('Waiting for receiver...');
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            resetState();
        }
    });

    peer.on('connection', (conn) => {
        connRef.current = conn;
        conn.on('open', () => {
            setTransferState('Receiver connected. Preparing to send...');
            conn.send({
                type: 'metadata',
                filename: fileToSend.name,
                filesize: fileToSend.size,
            });
        });

        conn.on('data', (data: any) => {
            if (data.type === 'ready') {
                setTransferState('Sending file...');
                sendFileInChunks(fileToSend, conn);
            } else if (data.type === 'transfer-complete') {
                toast({
                    title: 'Transfer complete!',
                    description: 'The receiver has successfully downloaded the file.',
                });
                setTimeout(() => {
                    resetState();
                }, 500);
            }
        });

        conn.on('close', () => {
            if (!transferState.includes('successfully')) {
                toast({
                    title: 'Transfer ended',
                    description: 'The receiver has closed the connection.',
                });
            }
            resetState();
        })
    });

    peer.on('error', (err) => {
        if(!generatedCode) {
            toast({
                title: 'Connection Error',
                description: err.message,
                variant: 'destructive',
            });
            resetState();
        }
    });
  };

  const sendFileInChunks = (file: File, conn: DataConnection) => {
      let offset = 0;
      const reader = new FileReader();

      reader.onload = () => {
          if (!reader.result) return;
          const chunk = reader.result as ArrayBuffer;
          conn.send({ type: 'chunk', payload: chunk });
          offset += chunk.byteLength;
          setSentSize(offset);

          if (offset < file.size) {
              readNextChunk();
          } else {
              conn.send({ type: 'done' });
              setTransferState('File sent successfully! Waiting for confirmation...');
          }
      };
      
      const readNextChunk = () => {
          const slice = file.slice(offset, offset + CHUNK_SIZE);
          reader.readAsArrayBuffer(slice);
      };

      readNextChunk();
  };

  const handleTextSend = async () => {
     if (!text) {
        toast({
            title: 'Nothing to send',
            description: 'Please enter some text.',
            variant: 'destructive',
        });
        return;
      }

      setIsLoading(true);
      setGeneratedCode(null);

      let expiryDate: Date;

      if (expiresAt) {
          const [hours, minutes] = time.split(':').map(Number);
          expiryDate = new Date(expiresAt.getFullYear(), expiresAt.getMonth(), expiresAt.getDate(), hours, minutes);
          if (expiryDate <= new Date()) {
              toast({ title: "Error", description: "Expiration date must be in the future.", variant: "destructive" });
              setIsLoading(false);
              return;
          }
      } else {
          expiryDate = add(new Date(), { days: 1 });
      }

      const apiBody = { 
        text: btoa(text),
        expires_at: expiryDate.toISOString() 
      };

      try {
        const response = await fetch('https://api.backend.avinash9.tech/transfer/text/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apiBody),
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

  const cancelTransfer = () => {
      resetState();
      toast({
          title: 'Transfer Cancelled',
          description: 'The file transfer has been cancelled.',
      })
  }

  if (generatedCode) {
    const progress = totalSize > 0 ? (sentSize / totalSize) * 100 : 0;
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
                        <div className="mt-4 text-center space-y-2">
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                                {sentSize < totalSize && <Loader2 className="h-4 w-4 animate-spin"/>}
                                {transferState}
                            </p>
                            {totalSize > 0 && sentSize < totalSize && (
                                <div className="w-full px-4">
                                  <Progress value={progress} className="w-full" />
                                  <p className="text-sm text-center mt-2 text-muted-foreground">
                                    { (sentSize / 1024 / 1024).toFixed(2) } MB / { (totalSize / 1024 / 1024).toFixed(2) } MB
                                  </p>
                                </div>
                            )}

                            {transferState.includes('Waiting') || (sentSize > 0 && sentSize < totalSize) || transferState.includes('Sending') ? (
                                <Button onClick={cancelTransfer} className="mt-4" variant="destructive" size="sm">
                                    <X className="mr-2 h-4 w-4"/>
                                    Cancel Transfer
                                </Button>
                            ) : null}
                        </div>
                    )}
                    {activeTab === 'text' && (
                        <Button onClick={resetState} className="mt-6 w-full" variant="outline">Share something else</Button>
                    )}
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
                                setFiles(null);
                            }}
                            aria-label="Text to send"
                            disabled={isLoading}
                        />
                         <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "w-full sm:w-[280px] justify-start text-left font-normal",
                                    !expiresAt && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {expiresAt ? format(expiresAt, "PPP") : <span>Set expiration (optional)</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                                <Calendar
                                    mode="single"
                                    selected={expiresAt}
                                    onSelect={setExpiresAt}
                                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                                />
                                 <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                                </PopoverContent>
                            </Popover>
                            {expiresIn && <p className="text-sm text-muted-foreground text-center sm:text-right flex-1">{expiresIn}</p>}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 p-2 bg-muted/50 rounded-md">
                            <Info className="h-4 w-4 flex-shrink-0" />
                            <span>Text is stored on our servers. You can set an optional expiration time. If not set, it defaults to 24 hours.</span>
                        </div>
                        <Button className="w-full" size="lg" type="submit" disabled={isLoading || !text}>
                           {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4" />}
                           {isLoading ? 'Sending...' : 'Send Text'}
                        </Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="file" className="mt-6">
                        <div className="space-y-4">
                            <FileUpload onFileSelect={(selectedFiles) => {
                                setFiles(selectedFiles);
                                setText('');
                            }}/>
                             <div className="text-xs text-muted-foreground flex items-center gap-1.5 p-2 bg-muted/50 rounded-md">
                                <Info className="h-4 w-4 flex-shrink-0" />
                                <span>Files are sent peer-to-peer and are not stored. The code will expire after 10 minutes if not used. The transfer will be cancelled if you reload the page.</span>
                            </div>
                            <Button className="w-full" size="lg" type="submit" disabled={isLoading || !files || files.length === 0}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4" />}
                                {isLoading ? 'Preparing...' : 'Send File'}
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
