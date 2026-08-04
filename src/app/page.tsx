"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { TextReveal } from "@/components/TextReveal";
import { Magnetic } from "@/components/Magnetic";
import { LiquidScroll } from "@/components/LiquidScroll";

const fadeUp: any = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const slideInLeft: any = {
    hidden: { opacity: 0, x: -50, scale: 0.9 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 1, ease: "easeOut" } }
};

const slideInRight: any = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut", delay: 0.2 } }
};

const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const Counter = ({ to, suffix = "" }: { to: number, suffix?: string }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (inView) {
            const controls = animate(0, to, {
                duration: 2.5,
                ease: "easeOut",
                onUpdate(value) {
                    setCount(Math.floor(value));
                }
            });
            return () => controls.stop();
        }
    }, [inView, to]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

export default function Home() {
    const [events, setEvents] = useState<any[]>([]);
    const [stats, setStats] = useState<any[]>([]);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [videoReviews, setVideoReviews] = useState<any[]>([]);
    const [navActive, setNavActive] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [origin, setOrigin] = useState('');
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Form States
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regEvent, setRegEvent] = useState('Public Speaking Workshop');
    const [regStatus, setRegStatus] = useState('');
    const [newsEmail, setNewsEmail] = useState('');
    const [newsStatus, setNewsStatus] = useState('');

    const handleRegister = async (e: any) => {
        e.preventDefault();
        setRegStatus('Registering...');
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: regName, email: regEmail, phone: regPhone, event_name: regEvent })
        });
        if (res.ok) {
            setRegStatus('Success! We will contact you soon.');
            setRegName(''); setRegEmail(''); setRegPhone('');
        } else setRegStatus('Failed to register. Try again.');
        setTimeout(() => setRegStatus(''), 4000);
    };

    const handleSubscribe = async (e: any) => {
        e.preventDefault();
        setNewsStatus('Subscribing...');
        const res = await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: newsEmail })
        });
        if (res.ok) {
            setNewsStatus('Subscribed!');
            setNewsEmail('');
        } else setNewsStatus('Already subscribed or failed.');
        setTimeout(() => setNewsStatus(''), 4000);
    };

    useEffect(() => setMounted(true), []);

    // Setup parallax scroll
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 1000], [0, 400]);
    const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 1000], [1, 1.2]);

    useEffect(() => {
        fetch('/api/events')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setEvents(data);
            })
            .catch(console.error);

        fetch('/api/statistics')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setStats(data);
            })
            .catch(console.error);

        fetch('/api/testimonials')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTestimonials(data);
            })
            .catch(console.error);

        fetch('/api/video-reviews')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setVideoReviews(data);
            })
            .catch(console.error);

        // Scroll listener for nav
        const handleScroll = () => {
            if (window.scrollY > 50) setScrolled(true);
            else setScrolled(false);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        setOrigin(window.location.origin);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleNav = () => setNavActive(!navActive);
    const closeNav = () => setNavActive(false);

    const getYouTubeEmbedUrl = (url: string) => {
        try {
            let videoId = '';
            if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split('?')[0];
            } else if (url.includes('youtube.com/watch')) {
                videoId = new URL(url).searchParams.get('v') || '';
            } else if (url.includes('youtube.com/embed/')) {
                return url;
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
        } catch {
            return url;
        }
    };

    return (
        <main style={{ overflow: 'hidden' }}>
            {/* Navigation */}
            <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
                <div className="nav-container">
                    <a href="#home" className="logo-link"><img src="/assets/logo.jpg" alt="IronSoul Logo" className="nav-logo" style={{ borderRadius: '5px' }} /></a>
                    <ul className={`nav-links ${navActive ? 'active' : ''}`}>
                        <Magnetic><li><a href="#home" onClick={closeNav}>Home</a></li></Magnetic>
                        <Magnetic><li><a href="#about" onClick={closeNav}>About</a></li></Magnetic>
                        <Magnetic><li><a href="#testimonials" onClick={closeNav}>Testimonials</a></li></Magnetic>
                        <Magnetic><li><a href="#team" onClick={closeNav}>Team</a></li></Magnetic>
                        <Magnetic><li><a href="/blog" onClick={closeNav}>Blog</a></li></Magnetic>
                        <Magnetic><li><a href="#programs" onClick={closeNav}>Programs</a></li></Magnetic>
                        <Magnetic><li><a href="#join" className="btn-primary" onClick={closeNav}>Join Us</a></li></Magnetic>
                        {mounted && (
                            <button 
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'inherit', marginLeft: '1rem' }}
                                title="Toggle Theme"
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                        )}
                    </ul>
                    <div className="hamburger" onClick={toggleNav}>
                        <span style={{ transform: navActive ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
                        <span style={{ opacity: navActive ? 0 : 1 }}></span>
                        <span style={{ transform: navActive ? 'rotate(-45deg) translate(7px, -7px)' : 'none' }}></span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
                <motion.div 
                    style={{ 
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                        backgroundImage: "linear-gradient(rgba(10, 10, 12, 0.7), rgba(10, 10, 12, 0.9)), url('/assets/hero.jpg')",
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        y: heroY,
                        scale: heroScale
                    }} 
                />

                <motion.div 
                    className="hero-content" 
                    initial="hidden" animate="visible" variants={staggerContainer}
                    style={{ zIndex: 2, opacity: heroOpacity }}
                >
                    <TextReveal text="Strength in Soul, Power in Action." className="hero-title highlight" />
                    <motion.p className="hero-subtitle" variants={fadeUp} style={{ marginTop: '1.5rem' }}>Empowering young minds to show their courage in speaking and leadership.</motion.p>
                    <Magnetic><motion.a href="#about" className="btn-primary btn-large" variants={fadeUp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Discover Our Mission</motion.a></Magnetic>
                </motion.div>
                <div className="hero-scroll" onClick={() => window.location.href = '#about'} style={{ position: 'absolute', bottom: '30px', left: '50%', cursor: 'pointer', zIndex: 3 }}>
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>↓</motion.div>
                </div>
            </section>

            {/* Impact Counter Section */}
            {stats.length > 0 && (
                <section className="impact-section">
                    <div className="container impact-grid">
                        {stats.map((st, i) => (
                            <motion.div key={st.id || i} className="impact-item" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.2 }}>
                                <h3><Counter to={st.value} suffix="+" /></h3>
                                <p>{st.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Testimonials Marquee */}
            {testimonials.length > 0 && (
                <section className="marquee-container">
                    <div className="marquee-content">
                        {[1, 2].map((group) => (
                            <div key={group} style={{ display: 'flex', gap: '3rem' }}>
                                {testimonials.map((t, i) => (
                                    <div key={t.id || i} className="marquee-card">
                                        <p>"{t.quote}"</p>
                                        <h4>- {t.author}</h4>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* About Section */}
            <section id="about" className="section">
                <div className="container">
                    <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.8 }} variants={fadeUp}>Who We Are</motion.h2>
                    <motion.div className="about-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>
                        
                        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2500}>
                            <motion.div className="about-card" variants={fadeUp} style={{ height: '100%', border: '1px solid rgba(212, 175, 55, 0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                <h3>Our Objective</h3>
                                <p>The primary objective of IronSoul Organisation is to empower students by nurturing confidence, resilience, and leadership qualities through motivational sessions and soft skill development programs. We prepare individuals to face real-world challenges with strength and positivity.</p>
                            </motion.div>
                        </Tilt>

                        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2500}>
                            <motion.div className="about-card" variants={fadeUp} style={{ height: '100%', border: '1px solid rgba(212, 175, 55, 0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                <h3>The IronSoul Pledge</h3>
                                <p className="pledge">"I pledge to uphold the values of IronSoul Organisation with honesty, discipline, respect, and dedication. I will strive to inspire others, continuously improve myself, work together with my team, and serve society with integrity. I will represent IronSoul with pride and responsibility."</p>
                            </motion.div>
                        </Tilt>

                    </motion.div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="section bg-alt">
                <div className="container">
                    <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>Our Work & Events</motion.h2>
                    <motion.p className="section-subtitle" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>A glimpse into our impact, workshops, and JAM sessions.</motion.p>
                    
                    <LiquidScroll>
                    <motion.div className="gallery-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
                        {events.length > 0 ? (
                            events.map((event: any) => (
                                <Tilt key={event.id} tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.02}>
                                    <motion.div className="gallery-item glass" variants={fadeUp} style={{ boxShadow: '0 15px 35px rgba(0,0,0,0.5)' }}>
                                        <img src={event.imagePath} alt={event.title} loading="lazy" />
                                        <div className="gallery-overlay">
                                            <div>
                                                <span>{event.title}</span>
                                                {event.description && <p style={{fontSize: '0.9rem', color: '#ccc'}}>{event.description}</p>}
                                            </div>
                                        </div>
                                    </motion.div>
                                </Tilt>
                            ))
                        ) : (
                            <motion.div variants={fadeUp}><p style={{textAlign: 'center', color: '#666'}}>No events published yet.</p></motion.div>
                        )}
                    </motion.div>
                    </LiquidScroll>
                </div>
            </section>

            {/* Team Section */}
            <section id="team" className="section">
                <div className="container">
                    <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>Our Executive Committee</motion.h2>
                    
                    {/* Founder Spotlight */}
                    <div style={{ overflow: 'hidden', padding: '10px 0' }}>
                        <motion.div className="founder-spotlight" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                            <motion.img src="/assets/bhanu.jpg" alt="Oggu Bhanu sasitha" loading="lazy" className="founder-spotlight-photo" onError={(e: any) => e.target.src='/assets/avatar.jpg'} variants={slideInLeft} />
                            <motion.div className="founder-spotlight-content" variants={slideInRight}>
                                <h3>Oggu Bhanu Sasitha</h3>
                                <h4>Founder, Public Speaker & Motivator</h4>
                                <p>Oggu Bhanu Sasitha has been struggling independently from birth to now, creating a brand for students to inspire and bring forth many "Bhanu’s" across the nation. She had the honour of meeting Prime Minister Narendra Modi in the Virtual Youth Budget Quest 2026, and has hosted numerous events as an MC, conducted impactful sessions as a public speaker, and inspired audiences as a motivational speaker. Through her initiatives in schools and universities, she continues to bring out hidden talents and channel them towards building a stronger nation.</p>
                            </motion.div>
                        </motion.div>
                    </div>

                    <motion.div className="team-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>

                        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
                            <motion.div className="team-card" variants={fadeUp}>
                                <img src="/assets/thushitha.jpg" alt="Kalavapalli Thushitha Reddy" loading="lazy" className="team-photo" onError={(e: any) => e.target.src='/assets/avatar.jpg'} />
                                <h3>Kalavapalli Thushitha Reddy</h3>
                                <p className="team-role">President</p>
                            </motion.div>
                        </Tilt>

                        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
                            <motion.div className="team-card" variants={fadeUp}>
                                <img src="/assets/santhosh.jpg" alt="Koduri Santhosh" loading="lazy" className="team-photo" onError={(e: any) => e.target.src='/assets/avatar.jpg'} />
                                <h3>Koduri Santhosh</h3>
                                <p className="team-role">Event Coordinator</p>
                            </motion.div>
                        </Tilt>

                        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
                            <motion.div className="team-card" variants={fadeUp}>
                                <img src="/assets/kaveri.jpg" alt="Andugula Kaveri" loading="lazy" className="team-photo" onError={(e: any) => e.target.src='/assets/avatar.jpg'} />
                                <h3>Andugula Kaveri</h3>
                                <p className="team-role">Chief Financial Officer (CFO)</p>
                            </motion.div>
                        </Tilt>

                        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
                            <motion.div className="team-card" variants={fadeUp}>
                                <img src="/assets/likhitha.jpg" alt="Patchava Likhitha" loading="lazy" className="team-photo" onError={(e: any) => e.target.src='/assets/avatar.jpg'} />
                                <h3>Patchava Likhitha</h3>
                                <p className="team-role">HR Manager</p>
                            </motion.div>
                        </Tilt>

                        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
                            <motion.div className="team-card" variants={fadeUp}>
                                <img src="/assets/joshna.jpg" alt="Renangi Joshna" loading="lazy" className="team-photo" onError={(e: any) => e.target.src='/assets/avatar.jpg'} />
                                <h3>Renangi Joshna</h3>
                                <p className="team-role">Development Head</p>
                            </motion.div>
                        </Tilt>

                    </motion.div>
                </div>
            </section>

            {/* Programs Section */}
            <section id="programs" className="section bg-alt">
                <div className="container">
                    <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>Our Programs</motion.h2>
                    <motion.p className="section-subtitle" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>Bringing young minds to show their courage in speaking with minimal charges.</motion.p>
                    
                    <LiquidScroll>
                    <motion.div className="programs-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>
                        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02}>
                            <motion.div className="program-card" variants={fadeUp} style={{ height: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
                                <div className="program-icon">🏫</div>
                                <h3>Plan for Schools</h3>
                                <div className="program-list" style={{ textAlign: 'left', margin: '1rem 0' }}>
                                    <p><strong>🎤 Session Structure:</strong> Orientation + JAM session (1 hr), Motivational talk + soft skill activity (1–2 hrs)</p>
                                    <p style={{ marginTop: '0.5rem' }}><strong>🏆 Prizes:</strong> Best Speaker, Most Confident Student, Participation E-Certificates for all.</p>
                                </div>
                                <div className="pricing">
                                    <p><strong>Session Cost:</strong> ₹2,000 – ₹5,000 / session</p>
                                    <p><strong>Membership Fee:</strong> ₹100 – ₹200 / year</p>
                                    <p><em>Benefits: JAM sessions, workshops, certificates, recognition badges</em></p>
                                </div>
                            </motion.div>
                        </Tilt>

                        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02}>
                            <motion.div className="program-card" variants={fadeUp} style={{ height: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
                                <div className="program-icon">🎓</div>
                                <h3>Plan for Colleges</h3>
                                <div className="program-list" style={{ textAlign: 'left', margin: '1rem 0' }}>
                                    <p><strong>🎤 Session Structure:</strong> Orientation + JAM session (1–2 hrs), Advanced workshops (communication, leadership, emotional intelligence), Motivational seminar (2–3 hrs)</p>
                                    <p style={{ marginTop: '0.5rem' }}><strong>🏆 Prizes:</strong> Best Speaker, Most Inspirational Leader, Best Communicator, Participation E-Certificates for all.</p>
                                </div>
                                <div className="pricing">
                                    <p><strong>Session Cost:</strong> ₹5,000 – ₹10,000 / session</p>
                                    <p><strong>Membership Fee:</strong> ₹300 – ₹500 / year</p>
                                    <p><em>Benefits: Leadership opportunities, advanced workshops, recognition badges, priority in events, Internships.</em></p>
                                </div>
                            </motion.div>
                        </Tilt>
                    </motion.div>
                    </LiquidScroll>
                </div>
            </section>

            {/* Event Registration Section */}
            <section id="register" className="section bg-alt" style={{ padding: '4rem 0' }}>
                <div className="container">
                    <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>Join Our Next Program</motion.h2>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--card-bg)', padding: '2rem', borderRadius: '15px', border: '1px solid var(--card-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Full Name</label>
                                <input type="text" value={regName} onChange={(e)=>setRegName(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-main)' }} placeholder="Your Name" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Email Address</label>
                                <input type="email" value={regEmail} onChange={(e)=>setRegEmail(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-main)' }} placeholder="email@example.com" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Phone Number</label>
                                <input type="tel" value={regPhone} onChange={(e)=>setRegPhone(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-main)' }} placeholder="+91 9876543210" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Select Event</label>
                                <select value={regEvent} onChange={(e)=>setRegEvent(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
                                    <option>Public Speaking Workshop</option>
                                    <option>Leadership Summit</option>
                                    <option>JAM Session Training</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Register Now</button>
                            {regStatus && <p style={{ textAlign: 'center', color: 'var(--accent-gold)', marginTop: '0.5rem' }}>{regStatus}</p>}
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Video Reviews Section */}
            {videoReviews.length > 0 && (
                <section className="section">
                    <div className="container">
                        <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>Video Testimonials</motion.h2>
                        <motion.div className="gallery-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
                            {videoReviews.map((video: any) => {
                                const isNativeVideo = video.url.includes('supabase.co/storage/v1/object/public/videos/');
                                const embedUrl = getYouTubeEmbedUrl(video.url);
                                return (
                                    <motion.div key={video.id} className="video-card" variants={fadeUp} style={{ background: 'var(--card-bg)', borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--card-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000' }}>
                                            {isNativeVideo ? (
                                                <video 
                                                    src={video.url} 
                                                    controls
                                                    preload="metadata"
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} 
                                                />
                                            ) : (
                                                <iframe 
                                                    src={embedUrl} 
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                    allowFullScreen
                                                />
                                            )}
                                        </div>
                                        <div style={{ padding: '1.5rem' }}>
                                            <h3 style={{ color: 'var(--accent-gold)', margin: 0, fontSize: '1.2rem' }}>{video.title}</h3>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Thank You Section & Newsletter */}
            <section id="join" className="section bg-alt" style={{ padding: '4rem 0' }}>
                <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
                    <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>Thank You For Visiting</motion.h2>
                    <motion.p style={{ color: 'var(--text-main)', opacity: 0.8, fontSize: '1.2rem', marginBottom: '2rem' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        Join us on our journey to empower youth leadership and confidence!
                    </motion.p>
                    
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: 'var(--card-bg)', padding: '2rem', borderRadius: '15px', border: '1px solid var(--card-border)' }}>
                        <h3 style={{ margin: 0, color: 'var(--accent-gold)' }}>Subscribe to our Newsletter</h3>
                        <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '400px', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                                <input type="email" value={newsEmail} onChange={(e)=>setNewsEmail(e.target.value)} required style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-main)' }} placeholder="Enter your email" />
                                <button type="submit" className="btn-primary" style={{ margin: 0 }}>Subscribe</button>
                            </div>
                            {newsStatus && <p style={{ color: 'var(--accent-gold)', margin: 0, fontSize: '0.9rem' }}>{newsStatus}</p>}
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Detailed Thank You Section */}
            <section className="section" style={{ padding: '4rem 0' }}>
                <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
                    <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>Our Gratitude</motion.h2>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#ccc' }}>
                        <p style={{ marginBottom: '1rem' }}>Ironsoul Organisation expresses its deepest gratitude to all the schools, colleges, students, faculty, and supporters who have stood with us in this journey. Your encouragement has been the driving force behind our mission to empower youth with confidence, resilience, and leadership.</p>
                        <p style={{ marginBottom: '1rem' }}>We thank the students who participated in our JAM sessions, workshops, and motivational events — each of you represents the spirit of strength and inspiration that Ironsoul stands for.</p>
                        <p style={{ marginBottom: '1rem' }}>Special thanks to our mentors, volunteers, and well wishers who continue to guide and support us. Every word of encouragement, every smile of appreciation, and every moment of collaboration strengthens our resolve to create many more "Bhanu’s" - individuals who rise with courage, inspire others, and contribute meaningfully to society.</p>
                        <p style={{ marginBottom: '1.5rem' }}>Together, we believe in building a brighter tomorrow where every student discovers their true potential and becomes a beacon of hope for the nation.</p>
                        <p style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '1.3rem' }}>Strength in Soul, Power in Action.</p>
                        <p>- Iron soul Organisation</p>
                    </motion.div>
                </div>
            </section>

            {/* Join Us Section */}
            <section id="join" className="section" style={{ position: 'relative' }}>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>Join IronSoul</motion.h2>
                    <motion.p className="section-subtitle" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>Become a symbol of strength, vision, and inspiration. Fill out the form below to become a member or invite us to your institution.</motion.p>
                    
                    <motion.div className="form-container" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ boxShadow: '0 20px 50px rgba(212, 175, 55, 0.05)' }}>
                        <form action="https://formsubmit.co/ironsoul2026@gmail.com" method="POST" className="membership-form">
                            <input type="hidden" name="_captcha" value="false" />
                            {origin && <input type="hidden" name="_next" value={`${origin}/#join`} />}
                            <input type="hidden" name="_subject" value="New IronSoul Application!" />
                            
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input type="text" id="name" name="name" required placeholder="John Doe" />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" name="email" required placeholder="john@example.com" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input type="tel" id="phone" name="phone" required placeholder="+91 XXXXX XXXXX" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="institution">Institution (School/College)</label>
                                <input type="text" id="institution" name="institution" required placeholder="Name of your School/College" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="interest">I am interested in:</label>
                                <select id="interest" name="interest" required>
                                    <option value="">Select an option...</option>
                                    <option value="school_member">School Membership (₹100-200/yr)</option>
                                    <option value="college_member">College Membership (₹300-500/yr)</option>
                                    <option value="school_session">Hosting a School Session</option>
                                    <option value="college_session">Hosting a College Session</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message (Optional)</label>
                                <textarea id="message" name="message" rows={4} placeholder="Tell us why you want to join..."></textarea>
                            </div>

                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary btn-submit">Submit Application</motion.button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer>
                <div className="container footer-content">
                    <div className="footer-brand">
                        <h2>IronSoul</h2>
                        <p>Strength in Soul, Power in Action.</p>
                        <p style={{ marginTop: '0.5rem' }}>Contact us: <a href="mailto:ironsoul2026@gmail.com" style={{ color: '#d4af37', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#d4af37'}>ironsoul2026@gmail.com</a></p>
                    </div>
                    <div className="footer-copy">
                        <p>&copy; 2026 IronSoul Organisation. All rights reserved. | <a href="/admin/login" style={{ color: '#d4af37', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#d4af37'}>Admin Portal</a></p>
                    </div>
                </div>
            </footer>

            {/* Floating Quick Contact */}
            <a href="mailto:ironsoul2026@gmail.com" className="floating-btn" title="Email Us">
                ✉️
            </a>
        </main>
    );
}
