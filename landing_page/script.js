
// Scroll-triggered Navbar
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.style.padding = '0.5rem 0';
        nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        nav.style.background = 'rgba(2, 6, 23, 0.8)';
    } else {
        nav.style.padding = '1rem 0';
        nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
        nav.style.background = 'rgba(255, 255, 255, 0.03)';
    }
});

// Simple Intersection Observer for Fade-in effects
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .price-card, .edu-content, .edu-image').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile Menu Toggle (Basic)
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // In a real app, you'd style the .active class in CSS for mobile overlay
});

// Add some interaction to CTA button
const ctaBtn = document.querySelector('.cta .btn-primary');
ctaBtn?.addEventListener('mouseover', () => {
    ctaBtn.style.transform = 'scale(1.05) rotate(-1deg)';
});
ctaBtn?.addEventListener('mouseout', () => {
    ctaBtn.style.transform = 'scale(1) rotate(0deg)';
});
