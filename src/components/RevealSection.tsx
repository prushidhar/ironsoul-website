"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface RevealProps {
    children: ReactNode;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
}

export function RevealSection({ children, id, className, style }: RevealProps) {
    return (
        <motion.section
            id={id}
            className={className}
            style={style}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            {children}
        </motion.section>
    );
}
