"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [editId, setEditId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [status, setStatus] = useState('');
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        // Check auth
        fetch('/api/auth').then(res => {
            if (!res.ok) router.push('/admin/login');
        });
        fetchEvents();
    }, [router]);

    const fetchEvents = () => {
        fetch('/api/events')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setEvents(data);
                else setEvents([]);
            })
            .catch(console.error);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
        if (res.ok) fetchEvents();
    };

    const handleEdit = (ev: any) => {
        setEditId(ev.id);
        setTitle(ev.title);
        setDescription(ev.description || '');
        setImage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditId('');
        setTitle('');
        setDescription('');
        setImage(null);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editId && (!image || !title)) return alert('Title and Image required for new events!');
        if (editId && !title) return alert('Title is required!');
        
        setStatus(editId ? 'Updating...' : 'Uploading...');
        const formData = new FormData();
        if (editId) formData.append('id', editId);
        formData.append('title', title);
        formData.append('description', description);
        if (image) formData.append('image', image);

        const res = await fetch('/api/events', {
            method: editId ? 'PUT' : 'POST',
            body: formData
        });

        if (res.ok) {
            setStatus(editId ? 'Successfully Updated!' : 'Successfully Uploaded!');
            cancelEdit();
            fetchEvents();
        } else {
            setStatus('Failed to save.');
        }
    };

    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
            <h1 className="section-title">Admin Dashboard</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '3rem' }}>
                <div className="form-container" style={{ margin: 0, height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#d4af37' }}>{editId ? 'Edit Event' : 'Upload New Event'}</h3>
                    <form onSubmit={handleUpload}>
                        <div className="form-group">
                            <label>Event Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Short Description (Optional)</label>
                            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Event Image {editId && '(Leave empty to keep current)'}</label>
                            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} required={!editId} />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn-primary btn-submit" style={{ margin: 0 }}>{editId ? 'Update Event' : 'Upload Event'}</button>
                            {editId && <button type="button" onClick={cancelEdit} className="btn-primary" style={{ margin: 0, background: '#333', color: '#fff' }}>Cancel</button>}
                        </div>
                        {status && <p style={{marginTop: '1rem', color: '#d4af37'}}>{status}</p>}
                    </form>
                </div>

                <div>
                    <h3 style={{ marginBottom: '1.5rem', color: '#d4af37' }}>Recent Events</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {events.length === 0 ? <p>No events uploaded yet.</p> : events.map((ev: any) => (
                            <div key={ev.id} style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px' }}>
                                <img src={ev.imagePath} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }} />
                                <div>
                                    <h4 style={{ margin: 0 }}>{ev.title}</h4>
                                    <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '0.5rem' }}>{ev.description}</p>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <button onClick={() => handleEdit(ev)} style={{ background: '#d4af37', color: '#000', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                                        <button onClick={() => handleDelete(ev.id)} style={{ background: '#ff4444', color: '#fff', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem', transition: 'background 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = '#cc0000'} onMouseOut={(e) => e.currentTarget.style.background = '#ff4444'}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
