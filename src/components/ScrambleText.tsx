"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!<>-_\\/[]{}—=+*^?#";

export function ScrambleText({ text, className }: { text: string, className?: string }) {
    const [display, setDisplay] = useState(text);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        
        let iteration = 0;
        let interval: any = null;
        
        clearInterval(interval);
        
        interval = setInterval(() => {
            setDisplay((prev) => 
                text.split("").map((letter, index) => {
                    if (index < iteration) return text[index];
                    return CHARS[Math.floor(Math.random() * CHARS.length)]
                }).join("")
            );
            
            if (iteration >= text.length) {
                clearInterval(interval);
            }
            iteration += 1 / 3;
        }, 30);

        return () => clearInterval(interval);
    }, [isInView, text]);

    return (
        <span ref={ref} className={className}>{display}</span>
    );
}
