'use client';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

const tabs = [
    { name: "Send", path: "/send" },
    { name: "Receive", path: "/receive" }
];

export function Tabs() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="">

        </div>
    );
}