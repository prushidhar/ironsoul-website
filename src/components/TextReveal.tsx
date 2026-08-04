"use client";

import { motion } from "framer-motion";

export function TextReveal({ text, className }: { text: string, className?: string }) {
    const words = text.split(" ");
    
    return (
        <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            className={className} 
            style={{ display: 'inline-block' }}
        >
            {words.map((word, i) => (
                <motion.span 
                    key={i} 
                    variants={{ 
                        hidden: { opacity: 0, y: 20 }, 
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } } 
                    }} 
                    style={{ display: 'inline-block', marginRight: '0.25em' }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
}
