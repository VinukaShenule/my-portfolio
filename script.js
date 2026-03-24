/* =============================================================
   SCRIPT.JS — Portfolio Animations & Interactions
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. PAGE LOADER ───────────────────────────────────────
    const loader = document.getElementById('loader');
    if (loader) {
        // CSS animation handles the fade-out at ~0.9s
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1600);
    }

    // ─── 2. CUSTOM CURSOR ─────────────────────────────────────
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');

    if (dot && ring) {
        // Hide default cursor
        document.body.style.cursor = 'none';

        let mouseX = 0, mouseY = 0;
        let ringX  = 0, ringY  = 0;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top  = mouseY + 'px';
        });

        // Smooth ring with lerp
        function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            ring.style.left = ringX + 'px';
            ring.style.top  = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Ring hover effect on interactive elements
        const interactives = document.querySelectorAll('a, button, .skill-card, .project-img-wrap');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            dot.style.opacity  = '0';
            ring.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            dot.style.opacity  = '1';
            ring.style.opacity = '1';
        });
    }

    // ─── 3. SCROLL REVEAL (Intersection Observer) ─────────────
    const revealEls = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -80px 0px'
    });

    revealEls.forEach(el => observer.observe(el));

    // ─── 4. NAVBAR SCROLL BEHAVIOR ────────────────────────────
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // ─── 5. SMOOTH SCROLL for anchor links ────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 85,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─── 6. SKILL CARDS — stagger on scroll entry ─────────────
    const skillCards = document.querySelectorAll('.skill-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 120); // 120ms stagger between cards
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    skillCards.forEach(card => {
        card.classList.add('reveal');        // add reveal class
        cardObserver.observe(card);
    });

    // ─── 7. TECH BADGE micro-hover ripple ─────────────────────
    document.querySelectorAll('.tech-badge').forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'scale(1.08)';
        });
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = 'scale(1)';
        });
    });

    // ─── 8. HERO PARALLAX on mouse move ───────────────────────
    const hero       = document.querySelector('.hero');
    const photoInner = document.querySelector('.hero-photo-inner');
    const photoRing  = document.querySelector('.hero-photo-ring');

    if (hero && photoInner && photoRing) {
        hero.addEventListener('mousemove', e => {
            if (window.innerWidth < 900) return;

            const { left, top, width, height } = hero.getBoundingClientRect();
            const cx = (e.clientX - left) / width  - 0.5; // -0.5 → 0.5
            const cy = (e.clientY - top)  / height - 0.5;

            // Subtle tilt for the photo
            photoInner.style.transform =
                `perspective(800px) rotateY(${cx * 8}deg) rotateX(${-cy * 8}deg) scale(1.01)`;
            // Ring drifts slightly
            photoRing.style.transform  =
                `translate(${cx * 12}px, ${cy * 12}px) rotate(${cx * 15}deg)`;
        });

        hero.addEventListener('mouseleave', () => {
            photoInner.style.transform = '';
            photoRing.style.transform  = `rotate(0deg)`;
        });
    }

    // ─── 9. PROJECT IMAGES — tilt on hover ────────────────────
    document.querySelectorAll('.project-img-wrap').forEach(wrap => {
        wrap.addEventListener('mousemove', e => {
            const { left, top, width, height } = wrap.getBoundingClientRect();
            const cx = (e.clientX - left) / width  - 0.5;
            const cy = (e.clientY - top)  / height - 0.5;
            wrap.style.transform =
                `perspective(900px) rotateY(${cx * 5}deg) rotateX(${-cy * 5}deg) translateY(-6px)`;
        });
        wrap.addEventListener('mouseleave', () => {
            wrap.style.transform = '';
        });
    });

    // ─── 10. FOOTER — animated underline on email ─────────────
    const emailBtn = document.querySelector('.email-button');
    if (emailBtn) {
        emailBtn.addEventListener('mouseenter', () => {
            emailBtn.style.letterSpacing = '0.03em';
        });
        emailBtn.addEventListener('mouseleave', () => {
            emailBtn.style.letterSpacing = '0';
        });
    }

});