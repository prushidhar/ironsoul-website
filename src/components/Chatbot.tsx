"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { id: Date.now().toString(), role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages })
            });

            if (!res.ok) throw new Error("Failed to fetch response");
            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            const assistantMsgId = (Date.now() + 1).toString();
            
            setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const text = decoder.decode(value, { stream: true });
                setMessages(prev => prev.map(msg => 
                    msg.id === assistantMsgId ? { ...msg, content: msg.content + text } : msg
                ));
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        style={{ 
                            background: 'var(--card-bg)', 
                            border: '1px solid var(--card-border)', 
                            borderRadius: '15px',
                            width: '350px',
                            height: '500px',
                            marginBottom: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div style={{ background: 'var(--accent-gold)', padding: '1rem', color: '#000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MessageCircle size={20} />
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>IronSoul AI</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {messages.length === 0 && (
                                <div style={{ textAlign: 'center', color: 'var(--text-main)', opacity: 0.7, marginTop: '2rem' }}>
                                    <p style={{ fontSize: '2rem', margin: '0 0 1rem 0' }}>👋</p>
                                    <p style={{ fontWeight: 'bold' }}>Hi there! I'm the IronSoul AI.</p>
                                    <p style={{ fontSize: '0.9rem' }}>Ask me anything about public speaking, leadership, or our events!</p>
                                </div>
                            )}
                            {messages.map((m: any) => (
                                <div key={m.id} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                    <div style={{ 
                                        background: m.role === 'user' ? 'var(--accent-gold)' : 'var(--bg-main)',
                                        color: m.role === 'user' ? '#000' : 'var(--text-main)',
                                        padding: '0.8rem 1rem',
                                        borderRadius: '15px',
                                        borderBottomRightRadius: m.role === 'user' ? '2px' : '15px',
                                        borderBottomLeftRadius: m.role === 'assistant' ? '2px' : '15px',
                                        border: m.role === 'assistant' ? '1px solid var(--card-border)' : 'none',
                                        lineHeight: 1.4,
                                        fontSize: '0.95rem'
                                    }}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div style={{ alignSelf: 'flex-start', background: 'var(--bg-main)', border: '1px solid var(--card-border)', padding: '0.8rem 1rem', borderRadius: '15px', borderBottomLeftRadius: '2px', color: 'var(--text-main)', opacity: 0.7, fontSize: '0.95rem' }}>
                                    Thinking...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} style={{ padding: '1rem', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '0.5rem', background: 'var(--bg-main)' }}>
                            <input 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)} 
                                placeholder="Type your message..." 
                                style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-main)', outline: 'none' }}
                            />
                            <button type="submit" disabled={isLoading || !input.trim()} style={{ background: 'var(--accent-gold)', color: '#000', border: 'none', borderRadius: '8px', width: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: (isLoading || !input.trim()) ? 0.5 : 1 }}>
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    style={{
                        background: 'var(--accent-gold)',
                        color: '#000',
                        border: 'none',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
                    }}
                >
                    <MessageCircle size={28} />
                </motion.button>
            )}
        </div>
    );
}
