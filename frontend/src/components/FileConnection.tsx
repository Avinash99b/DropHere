'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const steps = [
    'Connecting to sender...',
    'Establishing WebRTC session...',
    'Waiting for file...',
    'Receiving file chunks...',
    'Download complete'
];

export function FileConnection() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < steps.length - 1) {
            const timeout = setTimeout(() => setIndex(index + 1), 2000);
            return () => clearTimeout(timeout);
        }
    }, [index]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="mt-8 p-6 rounded-lg bg-zinc-900 border border-zinc-700 text-center"
    >
    <p className="text-white font-medium animate-pulse text-lg">{steps[index]}</p>
        <div className="h-2 w-full bg-zinc-700 rounded-full mt-4">
    <motion.div
        className="h-2 bg-green-400 rounded-full"
    initial={{ width: 0 }}
    animate={{ width: `${(index / (steps.length - 1)) * 100}%` }}
    transition={{ ease: 'easeInOut', duration: 0.5 }}
    />
    </div>
    </motion.div>
);
}
