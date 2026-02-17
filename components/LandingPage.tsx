
import React, { useEffect } from 'react';

const LandingPage: React.FC = () => {
    useEffect(() => {
        // Initialize Lucide icons
        if ((window as any).lucide) {
            (window as any).lucide.createIcons();
        }

        // Handle scroll animations
        const handleScroll = () => {
            const nav = document.querySelector('nav');
            if (window.scrollY > 50) {
                nav?.classList.add('scrolled');
            } else {
                nav?.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="landing-page-wrapper">
            <style>{`
                :root {
                    --primary: #10b981;
                    --primary-dark: #059669;
                    --secondary: #6366f1;
                    --bg-dark: #020617;
                    --bg-card: #0f172a;
                    --text-main: #f8fafc;
                    --text-sub: #94a3b8;
                    --glass: rgba(255, 255, 255, 0.03);
                    --glass-border: rgba(255, 255, 255, 0.08);
                }

                .landing-page-wrapper {
                    background-color: var(--bg-dark);
                    color: var(--text-main);
                    font-family: 'Inter', sans-serif;
                    line-height: 1.6;
                    overflow-x: hidden;
                    min-height: 100vh;
                }

                .landing-page-wrapper h1, .landing-page-wrapper h2, .landing-page-wrapper h3, .landing-page-wrapper .logo {
                    font-family: 'Outfit', sans-serif;
                    font-weight: 700;
                }

                .landing-page-wrapper .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }

                .landing-page-wrapper span {
                    color: var(--primary);
                }

                /* Glassmorphism Utility */
                .landing-page-wrapper .glass {
                    background: var(--glass);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid var(--glass-border);
                }

                /* Buttons */
                .landing-page-wrapper .btn-primary {
                    background: var(--primary);
                    color: white;
                    padding: 1rem 2rem;
                    border-radius: 1rem;
                    text-decoration: none;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 10px 30px -10px rgba(16, 185, 129, 0.4);
                }

                .landing-page-wrapper .btn-primary:hover {
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: 0 20px 40px -10px rgba(16, 185, 129, 0.6);
                }

                .landing-page-wrapper .btn-secondary {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                    padding: 0.8rem 1.5rem;
                    border-radius: 0.8rem;
                    text-decoration: none;
                    font-weight: 700;
                    border: 1px solid var(--glass-border);
                    transition: all 0.3s;
                }

                .landing-page-wrapper .btn-lg {
                    padding: 1.2rem 2.5rem;
                    font-size: 1.1rem;
                }

                .landing-page-wrapper .btn-link {
                    color: var(--text-sub);
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                /* Nav */
                .landing-page-wrapper nav {
                    position: fixed;
                    top: 0;
                    width: 100%;
                    z-index: 1000;
                    padding: 1rem 0;
                    transition: all 0.3s;
                }

                .landing-page-wrapper nav.scrolled {
                    padding: 0.5rem 0;
                    background: rgba(2, 6, 23, 0.8);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid var(--glass-border);
                }

                .landing-page-wrapper nav .container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .landing-page-wrapper .logo {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    font-size: 1.5rem;
                    letter-spacing: 2px;
                }

                .landing-page-wrapper .logo-icon {
                    background: var(--primary);
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .landing-page-wrapper .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 2.5rem;
                }

                .landing-page-wrapper .nav-links a {
                    text-decoration: none;
                    color: var(--text-sub);
                    font-weight: 500;
                    font-size: 0.9rem;
                    transition: color 0.3s;
                }

                .landing-page-wrapper .nav-links a:hover {
                    color: var(--primary);
                }

                /* Hero Section */
                .landing-page-wrapper .hero {
                    padding-top: 12rem;
                    padding-bottom: 8rem;
                    position: relative;
                    overflow: hidden;
                }

                .landing-page-wrapper .hero h1 {
                    font-size: 4.5rem;
                    line-height: 1.1;
                    margin-bottom: 2rem;
                    letter-spacing: -2px;
                }

                .landing-page-wrapper .hero p {
                    font-size: 1.2rem;
                    color: var(--text-sub);
                    margin-bottom: 3rem;
                    max-width: 550px;
                }

                .landing-page-wrapper .badge {
                    background: rgba(16, 185, 129, 0.1);
                    color: var(--primary);
                    padding: 0.5rem 1rem;
                    border-radius: 2rem;
                    font-size: 0.7rem;
                    font-weight: 900;
                    letter-spacing: 2px;
                    display: inline-block;
                    margin-bottom: 1.5rem;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }

                .landing-page-wrapper .hero-actions {
                    display: flex;
                    align-items: center;
                    gap: 2.5rem;
                    margin-bottom: 4rem;
                }

                .landing-page-wrapper .social-proof {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .landing-page-wrapper .avatars {
                    display: flex;
                }

                .landing-page-wrapper .avatars img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 3px solid var(--bg-dark);
                    margin-left: -12px;
                }

                .landing-page-wrapper .hero-image {
                    position: relative;
                }

                .landing-page-wrapper .image-wrapper img {
                    width: 100%;
                    border-radius: 3rem;
                    box-shadow: 0 50px 100px -20px rgba(0,0,0,0.5);
                }

                .landing-page-wrapper .stat-card {
                    position: absolute;
                    width: 200px;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    border-radius: 1.5rem;
                    z-index: 3;
                }

                .landing-page-wrapper .top-left { top: -5%; left: -10%; }
                .landing-page-wrapper .bottom-right { bottom: 10%; right: -5%; }

                .landing-page-wrapper .stat-card strong { font-size: 1.8rem; display: block; line-height: 1; margin-top: 4px;}
                .landing-page-wrapper .stat-card small { font-size: 0.6rem; font-weight: 900; color: var(--text-sub); letter-spacing: 1px; }

                .landing-page-wrapper .bg-glow {
                    position: absolute;
                    top: -10%;
                    right: -10%;
                    width: 800px;
                    height: 800px;
                    background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(2, 6, 23, 0) 70%);
                    z-index: 1;
                    pointer-events: none;
                }

                .landing-page-wrapper .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
                .landing-page-wrapper .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
                .landing-page-wrapper .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }

                .landing-page-wrapper .stats-bar {
                    padding: 4rem 0;
                    border-top: 1px solid var(--glass-border);
                    border-bottom: 1px solid var(--glass-border);
                    background: rgba(255, 255, 255, 0.01);
                }

                .landing-page-wrapper .stat-item { text-align: center; }
                .landing-page-wrapper .stat-item h3 { font-size: 3rem; margin-bottom: 0.5rem; }
                .landing-page-wrapper .stat-item p { color: var(--text-sub); font-weight: 700; text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; }

                .landing-page-wrapper .features { padding: 10rem 0; }
                .landing-page-wrapper .section-header { text-align: center; margin-bottom: 6rem; }
                .landing-page-wrapper .section-header h2 { font-size: 3.5rem; margin-bottom: 1.5rem; letter-spacing: -1px; }
                .landing-page-wrapper .section-header p { color: var(--text-sub); font-size: 1.1rem; max-width: 700px; margin: 0 auto; }

                .landing-page-wrapper .feature-card {
                    padding: 3.5rem;
                    border-radius: 2.5rem;
                    transition: all 0.3s;
                }

                .landing-page-wrapper .icon-box {
                    width: 60px;
                    height: 60px;
                    background: var(--primary);
                    border-radius: 1.2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 2rem;
                    color: white;
                }

                .landing-page-wrapper .educational { padding: 10rem 0; background-color: rgba(255, 255, 255, 0.01); }

                .landing-page-wrapper .comparison {
                    display: flex;
                    padding: 3rem;
                    border-radius: 3rem;
                    position: relative;
                    gap: 6rem;
                    align-items: center;
                }

                .landing-page-wrapper .side { flex: 1; }
                .landing-page-wrapper .divider {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    background: var(--bg-dark);
                    border: 1px solid var(--glass-border);
                    padding: 1.2rem;
                    border-radius: 50%;
                    font-weight: 900;
                    color: var(--primary);
                    z-index: 10;
                    box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
                }

                .landing-page-wrapper .pricing { padding: 10rem 0; }
                .landing-page-wrapper .price-card {
                    padding: 4rem 3rem;
                    border-radius: 3.5rem;
                    text-align: center;
                    position: relative;
                }

                .landing-page-wrapper .price-card.featured {
                    border: 3px solid var(--primary);
                    background: rgba(16, 185, 129, 0.05);
                    transform: scale(1.05);
                }

                .landing-page-wrapper .hot-badge {
                    position: absolute;
                    top: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--primary);
                    color: white;
                    padding: 0.6rem 1.5rem;
                    border-radius: 2rem;
                    font-size: 0.7rem;
                    font-weight: 900;
                }

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }

                .landing-page-wrapper .floating { animation: float 6s ease-in-out infinite; }

                @media (max-width: 768px) {
                    .landing-page-wrapper .grid-2, .landing-page-wrapper .grid-3, .landing-page-wrapper .grid-4 {
                        grid-template-columns: 1fr;
                    }
                    .landing-page-wrapper .hero h1 { font-size: 3rem; }
                    .landing-page-wrapper .nav-links { display: none; }
                }
            `}</style>

            <nav>
                <div className="container">
                    <div className="logo">
                        <div className="logo-icon"><i data-lucide="map-pin"></i></div>
                        <span>HANGRMAP</span>
                    </div>
                    <div className="nav-links">
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How it Works</a>
                        <a href="#pricing">Pricing</a>
                        <button onClick={() => window.location.href = '/login'} className="btn-secondary">Login</button>
                        <button onClick={() => window.location.href = '/signup'} className="btn-primary">Get Started</button>
                    </div>
                </div>
            </nav>

            <header className="hero">
                <div className="container grid-2">
                    <div className="hero-content">
                        <div className="badge">🚀 NEW: LAWN CARE SPECIAL EDITION</div>
                        <h1>The Future of <span>Lawn Care</span> Door Hangers</h1>
                        <p>Stop wasting money on marketing you can't track. HangrMap gives you real-time GPS verification, photo proof, and high-octane analytics.</p>
                        <div className="hero-actions">
                            <button onClick={() => window.location.href = '/signup'} className="btn-primary btn-lg">Start Free Trial <i data-lucide="arrow-right"></i></button>
                            <a href="#how-it-works" className="btn-link">See how it works</a>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="image-wrapper">
                            <img src="/landing_page/assets/hero.png" alt="HangrMap App" className="floating" />
                            <div className="stat-card glass p-4 top-left">
                                <i data-lucide="trending-up"></i>
                                <div><small>ROI INCREASE</small><strong>+42%</strong></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-glow"></div>
            </header>

            <section id="features" className="features">
                <div className="container">
                    <div className="section-header">
                        <h2>Built for <span>High-Performance</span> Teams</h2>
                        <p>Transition from manual flyers to a digital-first strategy.</p>
                    </div>
                    <div className="grid-3">
                        <div className="feature-card glass">
                            <div className="icon-box"><i data-lucide="navigation"></i></div>
                            <h3>Precision Tracking</h3>
                            <p>Live GPS breadcrumbs show exactly where your crew has been.</p>
                        </div>
                        <div className="feature-card glass">
                            <div className="icon-box"><i data-lucide="camera"></i></div>
                            <h3>Proof of Drop</h3>
                            <p>Force photo uploads for every marker. Metadata evidence for every lawn.</p>
                        </div>
                        <div className="feature-card glass">
                            <div className="icon-box"><i data-lucide="bar-chart-3"></i></div>
                            <h3>Deep Analytics</h3>
                            <p>See conversion rates by neighborhood. Double down on what works.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="pricing" className="pricing">
                <div className="container">
                    <div className="section-header">
                        <h2>Ready to <span>Dominate?</span></h2>
                        <p>Choose the plan that fits your crew size.</p>
                    </div>
                    <div className="grid-3">
                        <div className="price-card glass">
                            <h3>Solo</h3>
                            <div className="price">$19<span>/mo</span></div>
                            <button onClick={() => window.location.href = '/signup?plan=solo'} className="btn-secondary">Choose Solo</button>
                        </div>
                        <div className="price-card glass featured">
                            <div className="hot-badge">MOST POPULAR</div>
                            <h3>Crew</h3>
                            <div className="price">$49<span>/mo</span></div>
                            <button onClick={() => window.location.href = '/signup?plan=crew'} className="btn-primary">Choose Crew</button>
                        </div>
                        <div className="price-card glass">
                            <h3>Agency</h3>
                            <div className="price">$99<span>/mo</span></div>
                            <button onClick={() => window.location.href = '/signup?plan=agency'} className="btn-secondary">Choose Agency</button>
                        </div>
                    </div>
                </div>
            </section>

            <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
                <div className="container">
                    <div className="logo" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
                        <div className="logo-icon"><i data-lucide="map-pin"></i></div>
                        <span>HANGRMAP</span>
                    </div>
                    <p style={{ color: 'var(--text-sub)' }}>&copy; 2024 HangrMap SaaS. Built for winners.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
