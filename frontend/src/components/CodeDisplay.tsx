'use client';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";
import { toast } from "sonner";

export function CodeDisplay({ code, mode }: { code: string; mode: 'text' | 'file' }) {
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        toast.success("Code copied!");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 10 }}
            className="mt-8 p-6 rounded-lg bg-zinc-900 border border-zinc-700 shadow-xl text-center"
        >
            <h3 className="text-xl font-semibold mb-2">Your 6-digit Code</h3>
            <div className="text-4xl font-mono tracking-widest text-white mb-4">
                {code}
            </div>
            <Button onClick={handleCopy} variant="outline" className="flex items-center gap-2 mx-auto">
                <ClipboardCopy size={16} /> Copy Code
            </Button>
            {mode === 'file' && <p className="mt-4 text-sm text-yellow-400 animate-pulse">Waiting for receiver...</p>}
        </motion.div>
    );
}