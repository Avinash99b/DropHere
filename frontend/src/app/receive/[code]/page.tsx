'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, File, Loader2, Download } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Peer, DataConnection } from 'peerjs';


interface TransferData {
  text?: string;
  sender_peer_id?: string;
  type?: 'text' | 'file';
}

interface ReceivedFile {
    file: Blob;
    filename: string;
    filetype: string;
}

export default function ReceivePage() {
  const params = useParams();
  const code = params.code as string;
  const { toast } = useToast();
  const [data, setData] = useState<TransferData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [transferStatus, setTransferStatus] = useState('');
  const [receivedFile, setReceivedFile] = useState<ReceivedFile | null>(null);
  
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);

  const PeerJs = (() => {
    if (typeof window !== 'undefined') {
        return require('peerjs').default;
    }
    return null;
  })();

  useEffect(() => {
    if (!code || !PeerJs) return;

    const fetchContent = async () => {
      try {
        const typeRes = await fetch(`https://api.backend.avinash9.tech/transfer/${code}`);
        if(!typeRes.ok) {
            const errorData = await typeRes.json();
            throw new Error(errorData.error || `Failed to fetch transfer type`);
        }
        const typeData = await typeRes.json();
        
        if (typeData.type === 'text') {
            const res = await fetch(`https://api.backend.avinash9.tech/transfer/text/${code}`);
            if (res.ok) {
              const result = await res.json();
              setData({ text: atob(result.text), type: 'text' });
              setLoading(false);
              return;
            }
        } else if (typeData.type === 'file') {
            const res = await fetch(`https://api.backend.avinash9.tech/transfer/file/${code}`);
            if (res.ok) {
              const result = await res.json();
              setData({ sender_peer_id: result.sender_peer_id, type: 'file' });
              // Don't stop loading, as we now need to connect to peer
              return;
            }
        }
        
        const res = await typeRes.json();
        const errorData = res;
        throw new Error(errorData.error || `Failed to fetch data`);

      } catch (err: any) {
         if(err.message.includes("Not Found")) {
          setError("Transfer Code not found or expired");
         } else {
          setError(err.message);
         }
         setLoading(false);
      }
    }
    fetchContent();

    return () => {
      // Cleanup peer connection on component unmount
      if (connRef.current) connRef.current.close();
      if (peerRef.current) peerRef.current.destroy();
    }
  }, [code, PeerJs]);


  useEffect(() => {
    if (data?.sender_peer_id && data?.type === 'file' && PeerJs) {
        setLoading(true);
        setTransferStatus('Initializing...');
        const peer = new PeerJs();
        peerRef.current = peer;

        peer.on('open', () => {
            setTransferStatus(`Connecting to sender...`);
            const conn = peer.connect(data.sender_peer_id!);
            connRef.current = conn;

            conn.on('open', () => {
                setTransferStatus('Connection established. Waiting for file...');
            });

            conn.on('data', (fileData: any) => {
                setTransferStatus('File received!');
                const { file, filename, filetype } = fileData;
                const blob = new Blob([file], { type: filetype });
                setReceivedFile({ file: blob, filename, filetype });
                setLoading(false);
                toast({ title: "Success", description: "File received successfully."});

                // Acknowledge receipt
                conn.send('received');
            });

             conn.on('close', () => {
                setTransferStatus('Connection closed.');
            });
        });

        peer.on('error', (err) => {
            setError(`Connection Error: ${err.message}`);
            setTransferStatus('Error. Please try again.');
            setLoading(false);
        });
    }
  }, [data, PeerJs, toast]);

  const handleDownload = () => {
    if (receivedFile) {
        const url = URL.createObjectURL(receivedFile.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = receivedFile.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle>Content Received</CardTitle>
              <CardDescription>Content shared with code: <span className="font-bold text-primary">{code?.toUpperCase()}</span></CardDescription>
            </CardHeader>
            <CardContent>
              {loading && !error && (
                <div className="flex flex-col items-center justify-center space-y-4 p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">{transferStatus || 'Fetching transfer details...'}</p>
                </div>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {data && data.text && !loading && (
                <div className="p-4 border rounded-lg bg-muted/50 whitespace-pre-wrap">
                  {data.text}
                </div>
              )}
              {receivedFile && !loading && (
                <div className="p-4 border rounded-lg bg-muted/50 text-center">
                    <File className="w-16 h-16 mx-auto text-primary" />
                    <p className="font-semibold mt-4">{receivedFile.filename}</p>
                    <p className="text-sm text-muted-foreground">{ (receivedFile.file.size / 1024 / 1024).toFixed(2) } MB</p>
                    <Button onClick={handleDownload} className="mt-6">
                        <Download className="mr-2 h-4 w-4"/>
                        Download File
                    </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
