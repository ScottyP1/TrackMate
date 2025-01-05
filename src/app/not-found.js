"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.push("/");
        }, 3000);

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="text-lg mt-4">Oops! The page you're looking for doesn't exist.</p>
            <p className="text-gray-400 mt-2">Redirecting you back to the homepage...</p>
        </div>
    );
}
