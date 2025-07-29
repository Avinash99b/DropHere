'use client';
import { motion } from 'framer-motion';

export function TextDisplay({ code }: { code: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12 }}
            className="mt-8 p-6 rounded-lg bg-zinc-800 border border-zinc-600 shadow-lg"
        >
            <h3 className="text-lg font-semibold text-white mb-2">Received Text:</h3>
            <p className="text-zinc-300 whitespace-pre-wrap">Hello, here is the message linked to code {code}.</p>
        </motion.div>
    );
}