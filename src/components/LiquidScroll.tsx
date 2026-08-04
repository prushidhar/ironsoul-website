"use client";

import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { ReactNode } from "react";

export function LiquidScroll({ children, className }: { children: ReactNode, className?: string }) {
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    
    // Smooth out the velocity
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    
    // Map velocity to a skew value (max skew is 10deg)
    const skew = useTransform(smoothVelocity, [-1000, 1000], [-3, 3]);

    return (
        <motion.div style={{ skewY: skew }} className={className}>
            {children}
        </motion.div>
    );
}
