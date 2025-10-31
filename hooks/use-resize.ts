'use client';
import { useEffect, useRef, useState } from "react";
export type Size = { width: number; height: number };

export default function useResize(delay = 200): Size {
    const isClient = typeof window !== "undefined";
    const [size, setSize] = useState<Size>({
        width: isClient ? window.innerWidth : 1024,
        height: isClient ? window.innerHeight : 642,
    });

    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isClient) return;

        const handleResize = () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
            // debounce
            timeoutRef.current = window.setTimeout(() => {
                setSize({ width: window.innerWidth, height: window.innerHeight });
                timeoutRef.current = null;
            }, delay);
        };

        window.addEventListener("resize", handleResize, { passive: true });

        // in case size changed between render and effect
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [delay, isClient]);

    return size;
}