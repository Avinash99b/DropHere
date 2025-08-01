'use client';

import {useEffect, useState, useRef, useCallback} from 'react';
import {useParams} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Progress} from '@/components/ui/progress';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {AlertCircle, File, Loader2, Download, Copy, Check} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import {Button} from '@/components/ui/button';
import {useToast} from '@/hooks/use-toast';
import type {Peer, DataConnection} from 'peerjs';

interface TransferData {
    text?: string;
    sender_peer_id?: string;
    type?: 'text' | 'file';
}

interface FileMetadata {
    filename: string;
    filesize: number;
}

export default function ReceivePage() {
    const params = useParams();
    const code = params.code as string;
    const {toast} = useToast();
    const [data, setData] = useState<TransferData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [transferStatus, setTransferStatus] = useState('');

    const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);
    const [receivedSize, setReceivedSize] = useState(0);
    const [isDownloadComplete, setIsDownloadComplete] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const peerRef = useRef<Peer | null>(null);
    const connRef = useRef<DataConnection | null>(null);
    const fileStreamRef = useRef<WritableStreamDefaultWriter | null>(null);
    const streamSaverRef = useRef<any | null>(null);
    const PeerJsRef = useRef<any | null>(null);
    const isDownloadCompleteRef = useRef(false); // Ref to prevent race condition

    const cleanupPeer = useCallback(() => {
        if (connRef.current) connRef.current.close();
        if (peerRef.current) peerRef.current.destroy();
        if (fileStreamRef.current) {
            try {
                fileStreamRef.current.close();
            } catch (e) {
                console.error("Error closing file stream:", e);
            }
        }
        connRef.current = null;
        peerRef.current = null;
        fileStreamRef.current = null;
    }, []);

    useEffect(() => {
        // Dynamically import client-side libraries
        if (typeof window !== 'undefined') {
            import('peerjs').then(module => {
                PeerJsRef.current = module.default;
            });
            import('streamsaver').then(module => {
                streamSaverRef.current = module.default;
            });
        }

        if (!code) return;

        const fetchContent = async () => {
            try {
                const typeRes = await fetch(`https://api.backend.avinash9.tech/transfer/${code}`);
                if (!typeRes.ok) {
                    const errorData = await typeRes.json();
                    throw new Error(errorData.error || `Failed to fetch transfer type`);
                }
                const typeData = await typeRes.json();

                if (typeData.type === 'text') {
                    const res = await fetch(`https://api.backend.avinash9.tech/transfer/text/${code}`);
                    if (res.ok) {
                        const result = await res.json();
                        setData({text: atob(result.text), type: 'text'});
                    }
                } else if (typeData.type === 'file') {
                    const res = await fetch(`https://api.backend.avinash9.tech/transfer/file/${code}`);
                    if (res.ok) {
                        const result = await res.json();
                        setData({sender_peer_id: result.sender_peer_id, type: 'file'});
                    }
                } else {
                    throw new Error('Unsupported transfer type');
                }

            } catch (err: any) {
                if (err.message.includes("Not Found")) {
                    setError("Transfer Code not found or expired");
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchContent();

        return () => {
            cleanupPeer();
        }
    }, [code, cleanupPeer]);


    useEffect(() => {
        if (!data?.sender_peer_id || data?.type !== 'file' || !PeerJsRef.current || !streamSaverRef.current) return;

        if (peerRef.current) return;

        setLoading(true);
        setTransferStatus('Initializing...');

        const PeerJs = PeerJsRef.current;
        const streamSaver = streamSaverRef.current;

        const peer = new PeerJs();
        peerRef.current = peer;

        peer.on('open', () => {
            setTransferStatus(`Connecting to sender...`);
            const conn = peer.connect(data.sender_peer_id!);
            connRef.current = conn;

            conn.on('open', () => {
                setTransferStatus('Connection established. Waiting for file...');
            });

            conn.on('data', async (received: any) => {
                if (received.type === 'metadata') {
                    isDownloadCompleteRef.current = false; // Reset status for new transfer
                    setFileMetadata(received);
                    setReceivedSize(0);
                    setTransferStatus('Receiving file...');

                    const fileStream = streamSaver.createWriteStream(received.filename, {
                        size: received.filesize
                    });
                    fileStreamRef.current = fileStream.getWriter();

                    conn.send({type: 'ready'});
                } else if (received.type === 'chunk') {
                    const chunk = new Uint8Array(received.payload);
                    if (fileStreamRef.current) {
                        await fileStreamRef.current.write(chunk);
                    }
                    setReceivedSize(prev => prev + chunk.byteLength);
                } else if (received.type === 'done') {
                    if (fileStreamRef.current) {
                        await fileStreamRef.current.close();
                        fileStreamRef.current = null;
                    }
                    isDownloadCompleteRef.current = true; // Update ref immediately
                    setTransferStatus('File received successfully!');
                    setIsDownloadComplete(true);
                    setLoading(false);
                    toast({title: "Success", description: "File downloaded successfully."});

                    // Send confirmation back to sender
                    conn.send({type: 'transfer-complete'});

                    setTimeout(() => {
                        cleanupPeer();
                    }, 500);
                }
            });

            conn.on('close', () => {
                // Check the ref to avoid race condition
                if (!isDownloadCompleteRef.current) {
                    setTransferStatus('Connection closed by sender.');
                    setError('The transfer was cancelled or interrupted.');
                    setLoading(false);
                }
                cleanupPeer();
            });
        });

        peer.on('error', (err) => {
            setError(`Connection Error: ${err.message}`);
            setTransferStatus('Error. Please try again.');
            setLoading(false);
            cleanupPeer();
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, cleanupPeer, toast]);

    const copyToClipboard = () => {
        if (data?.text) {
            navigator.clipboard.writeText(data.text);
            setIsCopied(true);
            toast({
                title: 'Copied!',
                description: 'The text has been copied to your clipboard.',
            });
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const renderFileTransfer = () => {
        if (loading && !fileMetadata) {
            return (
                <div className="flex flex-col items-center justify-center space-y-4 p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                    <p className="text-muted-foreground">{transferStatus || 'Fetching transfer details...'}</p>
                </div>
            );
        }

        if (isDownloadComplete && fileMetadata) {
            return (
                <div className="p-4 border rounded-lg bg-muted/50 text-center">
                    <File className="w-16 h-16 mx-auto text-primary"/>
                    <p className="font-semibold mt-4">{fileMetadata.filename}</p>
                    <p className="text-sm text-muted-foreground">{(fileMetadata.filesize / 1024 / 1024).toFixed(2)} MB</p>
                    <div className="mt-6 flex flex-col items-center">
                        <p className="text-green-600 font-semibold">Download Complete!</p>
                        <p className="text-sm text-muted-foreground">The file has been saved to your downloads
                            folder.</p>
                    </div>
                </div>
            );
        }

        if (fileMetadata) {
            const progress = fileMetadata.filesize > 0
                ? (receivedSize / fileMetadata.filesize) * 100
                : 0;
            return (
                <div className="flex flex-col items-center justify-center space-y-4 p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                    <p className="text-muted-foreground">{transferStatus}</p>
                    <div className="w-full">
                        <Progress value={progress} className="w-full"/>
                        <p className="text-sm text-center mt-2 text-muted-foreground">
                            {(receivedSize / 1024 / 1024).toFixed(2)} MB
                            / {(fileMetadata.filesize / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                </div>
            )
        }

        return null;
    }


    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header/>
            <main className="flex-1 flex items-center justify-center py-12 md:py-24">
                <div className="container mx-auto px-4">
                    <Card className="w-full max-w-2xl mx-auto shadow-lg">
                        <CardHeader>
                            <CardTitle>Content Received</CardTitle>
                            <CardDescription>Content shared with code: <span
                                className="font-bold text-primary">{code?.toUpperCase()}</span></CardDescription>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4"/>
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            {data?.type === 'text' && data.text && !loading && (
                                <div className="relative">
                                    <div className="p-4 border rounded-lg bg-muted/50 whitespace-pre-wrap pr-12">
                                        {data.text}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={copyToClipboard}
                                        aria-label="Copy text"
                                    >
                                        {isCopied ? <Check className="h-5 w-5 text-green-500"/> :
                                            <Copy className="h-5 w-5"/>}
                                    </Button>
                                </div>
                            )}
                            {data?.type === 'file' && renderFileTransfer()}
                            {loading && !data?.sender_peer_id && (
                                <div className="flex flex-col items-center justify-center space-y-4 p-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                                    <p className="text-muted-foreground">Fetching transfer details...</p>
                                </div>
                            )}

                            <Button onClick={() => {
                                window.location.href = '/';
                            }} className="mt-6 w-full" variant="outline">Go Back</Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer/>
        </div>
    );
}