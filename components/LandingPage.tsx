
import React, { useEffect } from 'react';

const LandingPage: React.FC = () => {
    useEffect(() => {
        // Initialize Lucide icons
        if ((window as any).lucide) {
            (window as any).lucide.createIcons();
        }

        // Scroll-triggered Navbar
        const nav = document.querySelector('nav');
        const handleScroll = () => {
            if (nav) {
                if (window.scrollY > 50) {
                    nav.style.padding = '0.5rem 0';
                    nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
                    nav.style.background = 'rgba(2, 6, 23, 0.8)';
                } else {
                    nav.style.padding = '1rem 0';
                    nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
                    nav.style.background = 'rgba(255, 255, 255, 0.03)';
                }
            }
        };
        window.addEventListener('scroll', handleScroll);

        // Simple Intersection Observer for Fade-in effects
        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    (entry.target as HTMLElement).style.opacity = '1';
                    (entry.target as HTMLElement).style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card, .price-card, .edu-content, .edu-image').forEach(el => {
            (el as HTMLElement).style.opacity = '0';
            (el as HTMLElement).style.transform = 'translateY(30px)';
            (el as HTMLElement).style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
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

        .landing-page-wrapper * {
            box-sizing: border-box;
        }

        .landing-page-wrapper h1,
        .landing-page-wrapper h2,
        .landing-page-wrapper h3,
        .landing-page-wrapper .logo {
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

        .landing-page-wrapper .glass {
            background: var(--glass);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid var(--glass-border);
        }

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
            border: none;
            cursor: pointer;
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
            cursor: pointer;
        }

        .landing-page-wrapper .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
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

        .landing-page-wrapper nav {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 1000;
            padding: 1rem 0;
            transition: all 0.3s;
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

        .landing-page-wrapper .menu-toggle {
            display: none;
            background: none;
            border: none;
            color: white;
        }

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

        .landing-page-wrapper .avatars img:first-child {
            margin-left: 0;
        }

        .landing-page-wrapper .social-proof span {
            color: var(--text-sub);
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .landing-page-wrapper .hero-image {
            position: relative;
        }

        .landing-page-wrapper .image-wrapper {
            position: relative;
            z-index: 2;
        }

        .landing-page-wrapper .image-wrapper img {
            width: 100%;
            border-radius: 3rem;
            box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.5);
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

        .landing-page-wrapper .top-left {
            top: -5%;
            left: -10%;
        }

        .landing-page-wrapper .bottom-right {
            bottom: 10%;
            right: -5%;
        }

        .landing-page-wrapper .stat-card strong {
            font-size: 1.8rem;
            display: block;
            line-height: 1;
            margin-top: 4px;
        }

        .landing-page-wrapper .stat-card small {
            font-size: 0.6rem;
            font-weight: 900;
            color: var(--text-sub);
            letter-spacing: 1px;
        }

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

        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }

        .landing-page-wrapper .floating {
            animation: float 6s ease-in-out infinite;
        }

        .landing-page-wrapper .floating-delayed {
            animation: float 6s ease-in-out infinite 2s;
        }

        .landing-page-wrapper .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }

        .landing-page-wrapper .grid-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
        }

        .landing-page-wrapper .grid-4 {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
        }

        .landing-page-wrapper .stats-bar {
            padding: 4rem 0;
            border-top: 1px solid var(--glass-border);
            border-bottom: 1px solid var(--glass-border);
            background: rgba(255, 255, 255, 0.01);
        }

        .landing-page-wrapper .stat-item {
            text-align: center;
        }

        .landing-page-wrapper .stat-item h3 {
            font-size: 3rem;
            margin-bottom: 0.5rem;
        }

        .landing-page-wrapper .stat-item p {
            color: var(--text-sub);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 0.8rem;
        }

        .landing-page-wrapper .features {
            padding: 10rem 0;
        }

        .landing-page-wrapper .section-header {
            text-align: center;
            margin-bottom: 6rem;
        }

        .landing-page-wrapper .section-header h2 {
            font-size: 3.5rem;
            margin-bottom: 1.5rem;
            letter-spacing: -1px;
        }

        .landing-page-wrapper .section-header p {
            color: var(--text-sub);
            font-size: 1.1rem;
            max-width: 700px;
            margin: 0 auto;
        }

        .landing-page-wrapper .feature-card {
            padding: 3.5rem;
            border-radius: 2.5rem;
            transition: all 0.3s;
        }

        .landing-page-wrapper .feature-card:hover {
            background: rgba(255, 255, 255, 0.05);
            transform: translateY(-10px);
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

        .landing-page-wrapper .feature-card h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .landing-page-wrapper .feature-card p {
            color: var(--text-sub);
        }

        .landing-page-wrapper .educational {
            padding: 10rem 0;
            background-color: rgba(255, 255, 255, 0.01);
        }

        .landing-page-wrapper .comparison {
            display: flex;
            padding: 3rem;
            border-radius: 3rem;
            position: relative;
            gap: 6rem;
            align-items: center;
        }

        .landing-page-wrapper .side {
            flex: 1;
        }

        .landing-page-wrapper .side h4 {
            margin-bottom: 2rem;
            font-size: 1.2rem;
        }

        .landing-page-wrapper .side ul {
            list-style: none;
        }

        .landing-page-wrapper .side ul li {
            margin-bottom: 1.5rem;
            font-weight: 500;
            font-size: 1rem;
            position: relative;
            padding-left: 2rem;
        }

        .landing-page-wrapper .side ul li::before {
            content: '';
            position: absolute;
            left: 0;
            top: 8px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
        }

        .landing-page-wrapper .before ul li {
            color: rgba(255, 255, 255, 0.4);
        }

        .landing-page-wrapper .before ul li::before {
            background: #f43f5e;
            box-shadow: 0 0 10px #f43f5e;
        }

        .landing-page-wrapper .after ul li {
            color: var(--text-main);
        }

        .landing-page-wrapper .after ul li::before {
            background: var(--primary);
            box-shadow: 0 0 10px var(--primary);
        }

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
            font-size: 0.9rem;
            color: var(--primary);
            z-index: 10;
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
        }

        .landing-page-wrapper .edu-content h2 {
            font-size: 3.5rem;
            margin-bottom: 2rem;
        }

        .landing-page-wrapper .edu-content p {
            font-size: 1.1rem;
            color: var(--text-sub);
            margin-bottom: 3rem;
        }

        .landing-page-wrapper .benefit {
            display: flex;
            gap: 1.5rem;
            margin-bottom: 2.5rem;
        }

        .landing-page-wrapper .benefit .check {
            width: 32px;
            height: 32px;
            background: var(--primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .landing-page-wrapper .benefit strong {
            display: block;
            font-size: 1.1rem;
            margin-bottom: 0.4rem;
        }

        .landing-page-wrapper .benefit p {
            margin-bottom: 0;
            font-size: 1rem;
        }

        .landing-page-wrapper .pricing {
            padding: 10rem 0;
        }

        .landing-page-wrapper .price-card {
            padding: 4rem 3rem;
            border-radius: 3.5rem;
            text-align: center;
            position: relative;
            transition: all 0.3s;
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

        .landing-page-wrapper .price-card h3 {
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
        }

        .landing-page-wrapper .price-card .price {
            font-size: 4rem;
            font-weight: 900;
            line-height: 1;
            margin-bottom: 0.5rem;
        }

        .landing-page-wrapper .price-card .price span {
            font-size: 1.2rem;
            font-weight: 500;
            color: var(--text-sub);
        }

        .landing-page-wrapper .price-card>p {
            color: var(--text-sub);
            margin-bottom: 3rem;
            font-weight: 500;
        }

        .landing-page-wrapper .price-card ul {
            list-style: none;
            text-align: left;
            margin-bottom: 4rem;
        }

        .landing-page-wrapper .price-card ul li {
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            font-weight: 500;
        }

        .landing-page-wrapper .price-card ul li i {
            color: var(--primary);
            width: 18px;
            height: 18px;
        }

        .landing-page-wrapper .cta {
            padding-bottom: 10rem;
        }

        .landing-page-wrapper .cta-box {
            background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
            padding: 8rem 4rem;
            border-radius: 5rem;
            text-align: center;
            border: 1px solid var(--glass-border);
            position: relative;
            overflow: hidden;
        }

        .landing-page-wrapper .cta-box h2 {
            font-size: 5rem;
            line-height: 1;
            margin-bottom: 2rem;
        }

        .landing-page-wrapper .cta-box p {
            color: var(--text-sub);
            font-size: 1.3rem;
            max-width: 600px;
            margin: 0 auto 4rem;
        }

        .landing-page-wrapper .cta-box .small {
            margin-top: 1.5rem;
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .landing-page-wrapper footer {
            padding: 10rem 0 5rem;
            border-top: 1px solid var(--glass-border);
        }

        .landing-page-wrapper .footer-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 4rem;
            margin-bottom: 6rem;
        }

        .landing-page-wrapper .footer-brand .logo {
            margin-bottom: 1.5rem;
        }

        .landing-page-wrapper .footer-brand p {
            color: var(--text-sub);
            max-width: 300px;
            margin-top: 1rem;
        }

        .landing-page-wrapper .footer-links h4 {
            margin-bottom: 2.5rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 0.8rem;
            color: var(--text-sub);
        }

        .landing-page-wrapper .footer-links a {
            display: block;
            text-decoration: none;
            color: white;
            margin-bottom: 1rem;
            font-weight: 500;
            transition: color 0.3s;
        }

        .landing-page-wrapper .footer-links a:hover {
            color: var(--primary);
        }

        .landing-page-wrapper .footer-bottom {
            text-align: center;
            border-top: 1px solid var(--glass-border);
            padding-top: 4rem;
            color: var(--text-sub);
            font-size: 0.9rem;
        }

        @media (max-width: 1024px) {
            .landing-page-wrapper .grid-4,
            .landing-page-wrapper .grid-3 {
                grid-template-columns: repeat(2, 1fr);
            }
            .landing-page-wrapper .hero h1 { font-size: 3.5rem; }
            .landing-page-wrapper .cta-box h2 { font-size: 3.5rem; }
        }

        @media (max-width: 768px) {
            .landing-page-wrapper .grid-2 {
                grid-template-columns: 1fr;
                gap: 4rem;
            }
            .landing-page-wrapper nav .nav-links { display: none; }
            .landing-page-wrapper .menu-toggle { display: block; }
            .landing-page-wrapper .hero { padding-top: 8rem; text-align: center; }
            .landing-page-wrapper .hero p { margin: 0 auto 3rem; }
            .landing-page-wrapper .hero-actions { justify-content: center; }
            .landing-page-wrapper .hero-image { order: -1; }
            .landing-page-wrapper .grid-4,
            .landing-page-wrapper .grid-3 { grid-template-columns: 1fr; }
            .landing-page-wrapper .footer-grid { grid-template-columns: 1fr 1fr; }
            .landing-page-wrapper .comparison { flex-direction: column; gap: 4rem; }
            .landing-page-wrapper .divider { display: none; }
        }
      `}</style>

            <nav className="glass">
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
                    <button className="menu-toggle"><i data-lucide="menu"></i></button>
                </div>
            </nav>

            <header className="hero">
                <div className="container grid-2">
                    <div className="hero-content">
                        <div className="badge">🚀 NEW: 2024 CREW TRACKING</div>
                        <h1>The Future of <span>Door Hanger</span> Campaigns</h1>
                        <p>Stop wasting money on marketing you can't track. HangrMap gives you real-time GPS verification, photo proof, and high-octane analytics to scale your service business.</p>
                        <div className="hero-actions">
                            <button onClick={() => window.location.href = '/signup'} className="btn-primary btn-lg">Start Free Trial <i data-lucide="arrow-right"></i></button>
                            <a href="#how-it-works" className="btn-link">See how it works</a>
                        </div>
                        <div className="social-proof">
                            <div className="avatars">
                                <img src="https://i.pravatar.cc/100?u=1" alt="User" />
                                <img src="https://i.pravatar.cc/100?u=2" alt="User" />
                                <img src="https://i.pravatar.cc/100?u=3" alt="User" />
                            </div>
                            <span>Joined by 500+ local service agencies</span>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="image-wrapper">
                            <img src="/landing_page/assets/hero.png" alt="HangrMap App" className="floating" />
                            <div className="stat-card glass p-4 top-left floating-delayed">
                                <i data-lucide="trending-up" style={{ color: '#10b981' }}></i>
                                <div><small>ROI INCREASE</small><strong>+42%</strong></div>
                            </div>
                            <div className="stat-card glass p-4 bottom-right floating">
                                <i data-lucide="check-circle" style={{ color: '#10b981' }}></i>
                                <div><small>DROPS VERIFIED</small><strong>1.2M</strong></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-glow"></div>
            </header>

            <section id="stats" className="stats-bar">
                <div className="container grid-4">
                    <div className="stat-item"><h3>99.9%</h3><p>GPS Accuracy</p></div>
                    <div className="stat-item"><h3>2x</h3><p>Lead Conversion</p></div>
                    <div className="stat-item"><h3>0%</h3><p>Paper Waste</p></div>
                    <div className="stat-item"><h3>Instant</h3><p>Photo Verification</p></div>
                </div>
            </section>

            <section id="features" className="features">
                <div className="container">
                    <div className="section-header">
                        <h2>Built for <span>High-Performance</span> Teams</h2>
                        <p>Manual spreadsheets are the graveyard of marketing budget. Transition to a digital-first strategy.</p>
                    </div>
                    <div className="grid-3">
                        <div className="feature-card glass">
                            <div className="icon-box"><i data-lucide="navigation"></i></div>
                            <h3>Precision Tracking</h3>
                            <p>Live GPS breadcrumbs show exactly where your crew has been. No more "missed streets" or "lost hours".</p>
                        </div>
                        <div className="feature-card glass">
                            <div className="icon-box"><i data-lucide="camera"></i></div>
                            <h3>Proof of Drop</h3>
                            <p>Force photo uploads for every marker. High-quality visuals that prove the work was actually done.</p>
                        </div>
                        <div className="feature-card glass">
                            <div className="icon-box"><i data-lucide="bar-chart-3"></i></div>
                            <h3>Deep Analytics</h3>
                            <p>See conversion rates by neighborhood. Double down on what works, cut what doesn't.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="educational">
                <div className="container grid-2">
                    <div className="edu-image">
                        <div className="comparison glass">
                            <div className="side before">
                                <h4>Manual Way</h4>
                                <ul>
                                    <li>Trust-based "I did it" reports</li>
                                    <li>Blurred memory of streets</li>
                                    <li>Untraceable ROI</li>
                                    <li>Paper Clipboards</li>
                                </ul>
                            </div>
                            <div className="divider">VS</div>
                            <div className="side after">
                                <h4>HangrMap Way</h4>
                                <ul>
                                    <li>GPS Metadata Evidence</li>
                                    <li>Heatmap Visualization</li>
                                    <li>Attributable Leads</li>
                                    <li>Interactive Dashboard</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="edu-content">
                        <h2>Educate Your <span>Profit Margin</span></h2>
                        <p>Most agencies lose 30% of their marketing budget to "ghost drops"—door hangers that never leave the truck. HangrMap eliminates fraud by requiring evidence for every action.</p>
                        <div className="benefit">
                            <div className="check"><i data-lucide="check" style={{ color: 'white' }}></i></div>
                            <div>
                                <strong>Eliminate Employee Fraud</strong>
                                <p>Real-time tracking means you see them moving on the map.</p>
                            </div>
                        </div>
                        <div className="benefit">
                            <div className="check"><i data-lucide="check" style={{ color: 'white' }}></i></div>
                            <div>
                                <strong>Optimize Territory Spend</strong>
                                <p>Discover which neighborhoods actually convert into paying customers.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="pricing" className="pricing">
                <div className="container">
                    <div className="section-header">
                        <h2>Scale with <span>Confidence</span></h2>
                        <p>Choose the plan that fits your crew size. No hidden fees.</p>
                    </div>
                    <div className="grid-3">
                        <div className="price-card glass">
                            <h3>Solo</h3>
                            <div className="price">$19<span>/mo</span></div>
                            <p>Perfect for owner-operators</p>
                            <ul>
                                <li><i data-lucide="check"></i> 1 User</li>
                                <li><i data-lucide="check"></i> Unlimited Drops</li>
                                <li><i data-lucide="check"></i> Local Persistence</li>
                                <li><i data-lucide="check"></i> Basic Statistics</li>
                            </ul>
                            <button onClick={() => window.location.href = '/signup?plan=solo'} className="btn-secondary">Choose Solo</button>
                        </div>
                        <div className="price-card glass featured">
                            <div className="hot-badge">MOST POPULAR</div>
                            <h3>Crew</h3>
                            <div className="price">$49<span>/mo</span></div>
                            <p>For growing local teams</p>
                            <ul>
                                <li><i data-lucide="check"></i> Up to 5 Crew Members</li>
                                <li><i data-lucide="check"></i> Multi-Tenant Access</li>
                                <li><i data-lucide="check"></i> Real-time Map Overview</li>
                                <li><i data-lucide="check"></i> High Priority Support</li>
                            </ul>
                            <button onClick={() => window.location.href = '/signup?plan=crew'} className="btn-primary">Choose Crew</button>
                        </div>
                        <div className="price-card glass">
                            <h3>Agency</h3>
                            <div className="price">$99<span>/mo</span></div>
                            <p>Scale without limits</p>
                            <ul>
                                <li><i data-lucide="check"></i> Unlimited Crew</li>
                                <li><i data-lucide="check"></i> Custom QR Tracking</li>
                                <li><i data-lucide="check"></i> API Access</li>
                                <li><i data-lucide="check"></i> White-label Reports</li>
                            </ul>
                            <button onClick={() => window.location.href = '/signup?plan=agency'} className="btn-secondary">Choose Agency</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta">
                <div className="container">
                    <div className="cta-box">
                        <h2>Stop Guessing. <br />Start <span>Growing.</span></h2>
                        <p>Join the elite agencies using data to dominate their local markets. Setup takes less than 2 minutes.</p>
                        <div className="cta-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <button onClick={() => window.location.href = '/signup'} className="btn-primary btn-lg">Begin Your Domination</button>
                            <p className="small">14-day free trial • Cancel anytime</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer>
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <div className="logo">
                                <div className="logo-icon"><i data-lucide="map-pin"></i></div>
                                <span>HANGRMAP</span>
                            </div>
                            <p>Optimizing the last mile of local marketing.</p>
                        </div>
                        <div className="footer-links">
                            <h4>Product</h4>
                            <a href="#">Dashboard</a>
                            <a href="#">Tracking</a>
                            <a href="#">Pricing</a>
                        </div>
                        <div className="footer-links">
                            <h4>Legal</h4>
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                        </div>
                        <div className="footer-links">
                            <h4>Contact</h4>
                            <a href="#">Support</a>
                            <a href="#">Sales</a>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 HangrMap SaaS. Built for winners.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
