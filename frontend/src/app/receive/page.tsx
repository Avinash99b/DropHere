'use client';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TextDisplay } from "@/components/TextDisplay";
import { FileConnection } from "@/components/FileConnection";

export default function ReceivePage() {
    const [code, setCode] = useState('');
    const [mode, setMode] = useState<'text' | 'file' | null>(null);

    const handleSubmit = () => {
        const isText = parseInt(code) % 2 === 0;
        setMode(isText ? 'text' : 'file');
    };

    return (
        <div>
            <Input
                placeholder="Enter 6-digit code"
                className="mb-4 max-w-xs text-black"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <Button onClick={handleSubmit}>Submit</Button>

            {mode === 'text' && <TextDisplay code={code} />}
            {mode === 'file' && <FileConnection />}
        </div>
    );
}