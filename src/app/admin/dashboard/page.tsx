"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    
    // Auth & Generic State
    const [status, setStatus] = useState('');
    
    // Events State
    const [events, setEvents] = useState<any[]>([]);
    const [editEventId, setEditEventId] = useState('');
    const [eventTitle, setEventTitle] = useState('');
    const [eventDesc, setEventDesc] = useState('');
    const [eventImage, setEventImage] = useState<File | null>(null);

    // Stats State
    const [stats, setStats] = useState<any[]>([]);
    const [statLabel, setStatLabel] = useState('');
    const [statValue, setStatValue] = useState('');

    // Testimonials State
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [testQuote, setTestQuote] = useState('');
    const [testAuthor, setTestAuthor] = useState('');

    useEffect(() => {
        fetch('/api/auth').then(res => {
            if (!res.ok) router.push('/admin/login');
        });
        fetchData();
    }, [router]);

    const fetchData = () => {
        fetch('/api/events').then(res => res.json()).then(data => setEvents(Array.isArray(data) ? data : []));
        fetch('/api/statistics').then(res => res.json()).then(data => setStats(Array.isArray(data) ? data : []));
        fetch('/api/testimonials').then(res => res.json()).then(data => setTestimonials(Array.isArray(data) ? data : []));
    };

    const handleDelete = async (endpoint: string, id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        const res = await fetch(`/api/${endpoint}?id=${id}`, { method: 'DELETE' });
        if (res.ok) fetchData();
    };

    const handleEventUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editEventId && (!eventImage || !eventTitle)) return alert('Title and Image required!');
        if (editEventId && !eventTitle) return alert('Title is required!');
        
        setStatus('Saving Event...');
        const formData = new FormData();
        if (editEventId) formData.append('id', editEventId);
        formData.append('title', eventTitle);
        formData.append('description', eventDesc);
        if (eventImage) formData.append('image', eventImage);

        const res = await fetch('/api/events', { method: editEventId ? 'PUT' : 'POST', body: formData });
        if (res.ok) {
            setStatus('Event Saved!');
            setEditEventId(''); setEventTitle(''); setEventDesc(''); setEventImage(null);
            fetchData();
        } else setStatus('Failed to save event.');
        setTimeout(() => setStatus(''), 3000);
    };

    const handleStatUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!statLabel || !statValue) return alert('Label and value required!');
        setStatus('Saving Statistic...');
        const res = await fetch('/api/statistics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ label: statLabel, value: statValue })
        });
        if (res.ok) {
            setStatus('Statistic Saved!');
            setStatLabel(''); setStatValue('');
            fetchData();
        } else setStatus('Failed to save statistic.');
        setTimeout(() => setStatus(''), 3000);
    };

    const handleTestimonialUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!testQuote || !testAuthor) return alert('Quote and author required!');
        setStatus('Saving Testimonial...');
        const res = await fetch('/api/testimonials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quote: testQuote, author: testAuthor })
        });
        if (res.ok) {
            setStatus('Testimonial Saved!');
            setTestQuote(''); setTestAuthor('');
            fetchData();
        } else setStatus('Failed to save testimonial.');
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
            <h1 className="section-title">Admin Dashboard</h1>
            {status && <div style={{ background: '#d4af37', color: '#000', padding: '1rem', borderRadius: '10px', textAlign: 'center', marginBottom: '2rem', fontWeight: 'bold' }}>{status}</div>}

            {/* EVENTS SECTION */}
            <h2 style={{ color: '#d4af37', borderBottom: '1px solid #333', paddingBottom: '0.5rem', marginTop: '3rem' }}>1. Manage Gallery Events</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '2rem' }}>
                <div className="form-container" style={{ margin: 0, height: 'fit-content' }}>
                    <form onSubmit={handleEventUpload}>
                        <div className="form-group">
                            <label>Event Title</label>
                            <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Short Description (Optional)</label>
                            <input type="text" value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Event Image {editEventId && '(Leave empty to keep current)'}</label>
                            <input type="file" accept="image/*" onChange={(e) => setEventImage(e.target.files?.[0] || null)} required={!editEventId} />
                        </div>
                        <button type="submit" className="btn-primary btn-submit">{editEventId ? 'Update Event' : 'Upload Event'}</button>
                    </form>
                </div>
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {events.length === 0 ? <p>No events uploaded yet.</p> : events.map(ev => (
                            <div key={ev.id} style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px', alignItems: 'center' }}>
                                <img src={ev.imagePath} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }} />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0 }}>{ev.title}</h4>
                                </div>
                                <button onClick={() => handleDelete('events', ev.id)} style={{ background: '#ff4444', color: '#fff', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* STATISTICS SECTION */}
            <h2 style={{ color: '#d4af37', borderBottom: '1px solid #333', paddingBottom: '0.5rem', marginTop: '5rem' }}>2. Manage Impact Statistics</h2>
            <p style={{ color: '#aaa', marginBottom: '2rem' }}>If you add at least one statistic, the Impact section will automatically appear on the website.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                <div className="form-container" style={{ margin: 0, height: 'fit-content' }}>
                    <form onSubmit={handleStatUpload}>
                        <div className="form-group">
                            <label>Number Value (e.g., 50)</label>
                            <input type="number" value={statValue} onChange={(e) => setStatValue(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Label (e.g., Workshops Conducted)</label>
                            <input type="text" value={statLabel} onChange={(e) => setStatLabel(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-primary btn-submit">Add Statistic</button>
                    </form>
                </div>
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {stats.length === 0 ? <p>No statistics added yet.</p> : stats.map(st => (
                            <div key={st.id} style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, color: '#d4af37' }}>{st.value}+</h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem' }}>{st.label}</p>
                                </div>
                                <button onClick={() => handleDelete('statistics', st.id)} style={{ background: '#ff4444', color: '#fff', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* TESTIMONIALS SECTION */}
            <h2 style={{ color: '#d4af37', borderBottom: '1px solid #333', paddingBottom: '0.5rem', marginTop: '5rem' }}>3. Manage Testimonials</h2>
            <p style={{ color: '#aaa', marginBottom: '2rem' }}>If you add at least one testimonial, the scrolling Marquee will automatically appear on the website.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                <div className="form-container" style={{ margin: 0, height: 'fit-content' }}>
                    <form onSubmit={handleTestimonialUpload}>
                        <div className="form-group">
                            <label>Quote</label>
                            <textarea value={testQuote} onChange={(e) => setTestQuote(e.target.value)} required rows={4} />
                        </div>
                        <div className="form-group">
                            <label>Author / Role</label>
                            <input type="text" value={testAuthor} onChange={(e) => setTestAuthor(e.target.value)} required placeholder="e.g. Rahul S., Student" />
                        </div>
                        <button type="submit" className="btn-primary btn-submit">Add Testimonial</button>
                    </form>
                </div>
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {testimonials.length === 0 ? <p>No testimonials added yet.</p> : testimonials.map(test => (
                            <div key={test.id} style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: '0 0 0.5rem 0', fontStyle: 'italic', fontSize: '0.9rem' }}>"{test.quote}"</p>
                                    <h4 style={{ margin: 0, color: '#d4af37', fontSize: '0.8rem' }}>- {test.author}</h4>
                                </div>
                                <button onClick={() => handleDelete('testimonials', test.id)} style={{ background: '#ff4444', color: '#fff', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
