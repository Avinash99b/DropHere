'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CodeDisplay } from "@/components/CodeDisplay";

export default function SendPage() {
    const [mode, setMode] = useState<'text' | 'file'>('text');
    const [code, setCode] = useState<string | null>(null);

    const generateCode = () => {
        const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
        setCode(randomCode);
    };

    return(
        <div>

        </div>
    )

    return (
        <Card className="w-full  mt-10 bg-zinc-900 border-zinc-700 text-white">
            <CardHeader>
                <CardTitle className="text-xl">Send {mode === 'text' ? 'Text' : 'File'}</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="flex gap-4 mb-6">
                    <Button variant={mode === 'text' ? 'default' : 'outline'} onClick={() => setMode('text')}>Text</Button>
                    <Button variant={mode === 'file' ? 'default' : 'outline'} onClick={() => setMode('file')}>File</Button>
                </div>

                {mode === 'text' ? (
                    <textarea
                        placeholder="Type your message..."
                        className="w-full bg-zinc-800 p-4 rounded-md text-white h-40 mb-4 border border-zinc-700 resize-none"
                    />
                ) : (
                    <div className="border border-dashed border-zinc-600 p-6 rounded-md bg-zinc-800 text-center text-zinc-300">
                        <p>Drop file to send (UI only)</p>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between items-center">
                <Button onClick={generateCode}>Send</Button>
                {code && <CodeDisplay code={code} mode={mode} />}
            </CardFooter>
        </Card>
    );
}
