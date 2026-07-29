"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        
        if (res.ok) {
            router.push('/admin/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="hero" style={{ height: '100vh', background: '#0a0a0c' }}>
            <div className="form-container" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="section-title" style={{ fontSize: '2rem' }}>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder="Enter admin password..."
                        />
                    </div>
                    {error && <p style={{color: '#ff4444', marginBottom: '1rem'}}>{error}</p>}
                    <button type="submit" className="btn-primary btn-submit">Login</button>
                </form>
            </div>
        </div>
    );
}
