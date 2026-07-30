"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Tilt from "react-parallax-tilt";

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

export default function Home() {
    const [events, setEvents] = useState<any[]>([]);
    const [navActive, setNavActive] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    // Parallax background for hero
    const { scrollY } = useScroll();
    const yHero = useTransform(scrollY, [0, 1000], [0, 300]);

    useEffect(() => {
        // Fetch events
        fetch('/api/events')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setEvents(data);
                else setEvents([]);
            })
            .catch(console.error);

        // Scroll listener for nav
        const handleScroll = () => {
            if (window.scrollY > 50) setScrolled(true);
            else setScrolled(false);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleNav = () => setNavActive(!navActive);
    const closeNav = () => setNavActive(false);

    return (
        <main style={{ overflow: 'hidden' }}>
            {/* Navigation */}
            <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
                <div className="nav-container">
                    <a href="#home" className="logo-link"><img src="/assets/logo.jpg" alt="IronSoul Logo" className="nav-logo" style={{ borderRadius: '5px' }} /></a>
                    <ul className={`nav-links ${navActive ? 'active' : ''}`}>
                        <li><a href="#home" onClick={closeNav}>Home</a></li>
                        <li><a href="#about" onClick={closeNav}>About</a></li>
                        <li><a href="#gallery" onClick={closeNav}>Gallery</a></li>
                        <li><a href="#team" onClick={closeNav}>Team</a></li>
                        <li><a href="#programs" onClick={closeNav}>Programs</a></li>
                        <li><a href="#join" className="btn-primary" onClick={closeNav}>Join Us</a></li>
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
                        y: yHero
                    }} 
                />
                
                {/* Floating glowing orbs for ultra-premium feel */}
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)', zIndex: 1 }}
                />
                <motion.div
                    animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                    style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(50px)', zIndex: 1 }}
                />

                <motion.div 
                    className="hero-content" 
                    initial="hidden" animate="visible" variants={staggerContainer}
                    style={{ zIndex: 2 }}
                >
                    <motion.h1 className="hero-title" variants={fadeUp}>Strength in Soul,<br/><span className="highlight">Power in Action.</span></motion.h1>
                    <motion.p className="hero-subtitle" variants={fadeUp}>Empowering young minds to show their courage in speaking and leadership.</motion.p>
                    <motion.a href="#about" className="btn-primary btn-large" variants={fadeUp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Discover Our Mission</motion.a>
                </motion.div>
            </section>

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
                    
                    <motion.div className="gallery-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
                        {events.length > 0 ? (
                            events.map((event: any) => (
                                <Tilt key={event.id} tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.02}>
                                    <motion.div className="gallery-item" variants={fadeUp} style={{ boxShadow: '0 15px 35px rgba(0,0,0,0.5)' }}>
                                        <img src={event.imagePath} alt={event.title} />
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
                </div>
            </section>

            {/* Team Section */}
            <section id="team" className="section">
                <div className="container">
                    <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>Our Executive Committee</motion.h2>
                    
                    {/* Founder Spotlight */}
                    <div style={{ overflow: 'hidden', padding: '10px 0' }}>
                        <motion.div className="founder-spotlight" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                            <motion.img src="/assets/bhanu.jpg" alt="Oggu Bhanu sasitha" className="founder-spotlight-photo" onError={(e: any) => e.target.src='/assets/avatar.jpg'} variants={slideInLeft} />
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
                                <img src="/assets/thushitha.jpg" alt="Kalavapalli Thushitha Reddy" className="team-photo" onError={(e: any) => e.target.src='/assets/avatar.jpg'} />
                                <h3>Kalavapalli Thushitha Reddy</h3>
                                <p className="team-role">President</p>
                            </motion.div>
                        </Tilt>

                        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
                            <motion.div className="team-card" variants={fadeUp}>
                                <img src="/assets/santhosh.jpg" alt="Koduri Santhosh" className="team-photo" onError={(e: any) => e.target.src='/assets/avatar.jpg'} />
                                <h3>Koduri Santhosh</h3>
                                <p className="team-role">Event Coordinator</p>
                            </motion.div>
                        </Tilt>

                        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
                            <motion.div className="team-card" variants={fadeUp}>
                                <img src="/assets/kaveri.jpg" alt="Andugula Kaveri" className="team-photo" onError={(e: any) => e.target.src='/assets/avatar.jpg'} />
                                <h3>Andugula Kaveri</h3>
                                <p className="team-role">Chief Financial Officer (CFO)</p>
                            </motion.div>
                        </Tilt>

                        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
                            <motion.div className="team-card" variants={fadeUp}>
                                <img src="/assets/likhitha.jpg" alt="Patchava Likhitha" className="team-photo" onError={(e: any) => e.target.src='/assets/avatar.jpg'} />
                                <h3>Patchava Likhitha</h3>
                                <p className="team-role">HR Manager</p>
                            </motion.div>
                        </Tilt>

                        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
                            <motion.div className="team-card" variants={fadeUp}>
                                <img src="/assets/joshna.jpg" alt="Renangi Joshna" className="team-photo" onError={(e: any) => e.target.src='/assets/avatar.jpg'} />
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
                </div>
            </section>

            {/* Thank You Section */}
            <section className="section bg-alt" style={{ padding: '4rem 0' }}>
                <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
                    <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>Thank You</motion.h2>
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
                            <input type="hidden" name="_next" value="http://localhost:3000/#join" />
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
        </main>
    );
}
