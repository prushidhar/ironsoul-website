"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function PageLoader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Wait 1.5 seconds before lifting curtain
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ y: 0 }}
            animate={{ y: isLoading ? 0 : "-100vh" }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: '#050506',
                zIndex: 99999999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ textAlign: 'center' }}
            >
                <img src="/assets/logo.jpg" alt="IronSoul" style={{ width: '80px', borderRadius: '10px', marginBottom: '1rem' }} />
                <h1 style={{ color: '#D97706', fontSize: '2rem', letterSpacing: '2px', fontWeight: 'bold' }}>IRONSOUL</h1>
                <p style={{ color: '#E2E8F0', letterSpacing: '1px' }}>Power in Action</p>
            </motion.div>
        </motion.div>
    );
}
