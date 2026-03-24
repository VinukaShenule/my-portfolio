/* ================================================================
   SCRIPT.JS — Premium Animations & Interactions
   ================================================================ */

/* ── Helpers ────────────────────────────────────────────────────── */
const qs  = (s, ctx = document) => ctx.querySelector(s);
const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

/* ================================================================
   1. PAGE LOADER
   ================================================================ */
(function initLoader() {
  const loader = qs('#loader');
  const fill   = qs('#loaderFill');
  if (!loader || !fill) return;

  // Animate bar to 100%
  setTimeout(() => { fill.style.width = '100%'; }, 100);

  // Fade out loader
  setTimeout(() => {
    loader.classList.add('hide');
    setTimeout(() => { loader.style.display = 'none'; }, 600);
  }, 1100);
})();

/* ================================================================
   2. HERO PARTICLE CANVAS
   ================================================================ */
(function initCanvas() {
  const canvas  = qs('#hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56,189,248,${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.floor((W * H) / 12000);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56,189,248,${0.08 * (1 - dist/maxDist)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  resize();
  initParticles();
  animate();
  window.addEventListener('resize', () => { resize(); initParticles(); });
})();

/* ================================================================
   3. CUSTOM CURSOR
   ================================================================ */
(function initCursor() {
  const dot  = qs('#cDot');
  const ring = qs('#cRing');
  if (!dot || !ring) return;

  document.body.style.cursor = 'none';
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function lerpRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();

  qsa('a, button, .g-card, .proj-img, .btn-sky, .btn-ghost').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('expand'));
    el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();

/* ================================================================
   4. TYPEWRITER EFFECT
   ================================================================ */
(function initTypewriter() {
  const el = qs('#typed');
  if (!el) return;
  const roles = [
    'Full-Stack Developer',
    'Computer Science Undergraduate',
    'Flutter App Developer',
    'Problem Solver',
    'UI/UX Enthusiast',
  ];
  let ri = 0, ci = 0, deleting = false;
  const speed = { type: 75, delete: 40, pause: 1800 };

  function tick() {
    const current = roles[ri];
    if (!deleting) {
      el.textContent = current.slice(0, ci + 1);
      ci++;
      if (ci === current.length) {
        setTimeout(() => { deleting = true; tick(); }, speed.pause);
        return;
      }
    } else {
      el.textContent = current.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? speed.delete : speed.type);
  }
  setTimeout(tick, 1400);
})();

/* ================================================================
   5. SCROLL REVEAL
   ================================================================ */
(function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

  qsa('.reveal').forEach(el => obs.observe(el));
})();

/* ================================================================
   6. SKILL PROGRESS BARS (animate on scroll)
   ================================================================ */
(function initBars() {
  const bars = qsa('.bar-fill');
  if (!bars.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const w = e.target.dataset.w;
        e.target.style.width = w + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => obs.observe(b));
})();

/* ================================================================
   7. STAT COUNTER ANIMATION
   ================================================================ */
(function initCounters() {
  const nums = qsa('[data-target]');
  if (!nums.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.target);
        let current = 0;
        const step = Math.ceil(target / 30);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          e.target.textContent = current + '+';
        }, 50);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(n => obs.observe(n));
})();

/* ================================================================
   8. NAVBAR SCROLL STATE
   ================================================================ */
(function initNavbar() {
  const nav = qs('#navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();

/* ================================================================
   9. SMOOTH SCROLL
   ================================================================ */
qsa('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = qs(href);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 90, behavior: 'smooth' });
    }
  });
});

/* ================================================================
   10. HERO PHOTO PARALLAX TILT
   ================================================================ */
(function initTilt() {
  const hero   = qs('.hero');
  const frame  = qs('.photo-frame');
  const ring   = qs('.photo-ring');
  const glow   = qs('.photo-glow');
  if (!hero || !frame) return;

  hero.addEventListener('mousemove', e => {
    if (window.innerWidth < 980) return;
    const { left, top, width, height } = hero.getBoundingClientRect();
    const cx = (e.clientX - left) / width  - 0.5;
    const cy = (e.clientY - top)  / height - 0.5;
    frame.style.transform = `perspective(900px) rotateY(${cx * 10}deg) rotateX(${-cy * 10}deg)`;
    if (ring) ring.style.transform = `rotate(${cx * 20}deg) scale(1.05)`;
    if (glow) { glow.style.transform = `translate(${cx * 20}px, ${cy * 20}px)`; }
  });
  hero.addEventListener('mouseleave', () => {
    frame.style.transform = '';
    if (ring) ring.style.transform = '';
    if (glow) glow.style.transform = '';
  });
})();

/* ================================================================
   11. PROJECT IMAGE TILT
   ================================================================ */
qsa('.proj-img').forEach(el => {
  el.addEventListener('mousemove', e => {
    const { left, top, width, height } = el.getBoundingClientRect();
    const cx = (e.clientX - left) / width  - 0.5;
    const cy = (e.clientY - top)  / height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${cx * 6}deg) rotateX(${-cy * 6}deg) translateY(-8px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

/* ================================================================
   12. RIPPLE CLICK EFFECT on buttons
   ================================================================ */
qsa('.btn-sky, .btn-ghost, .nav-cta').forEach(btn => {
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.addEventListener('click', e => {
    const { left, top } = btn.getBoundingClientRect();
    const size = Math.max(btn.offsetWidth, btn.offsetHeight);
    const el = document.createElement('span');
    el.className = 'ripple-el';
    Object.assign(el.style, {
      width:  size + 'px', height: size + 'px',
      left:   (e.clientX - left - size / 2) + 'px',
      top:    (e.clientY - top  - size / 2) + 'px',
    });
    btn.appendChild(el);
    setTimeout(() => el.remove(), 700);
  });
});

/* ================================================================
   13. MOBILE MENU
   ================================================================ */
function toggleMob() {
  const menu = qs('#mobileMenu');
  const ham  = qs('#hamburger');
  menu.classList.toggle('open');
  ham.classList.toggle('open');
}
function closeMob() {
  qs('#mobileMenu').classList.remove('open');
  qs('#hamburger').classList.remove('open');
}
window.toggleMob = toggleMob;
window.closeMob  = closeMob;

/* ================================================================
   14. CARD HOVER GLOW (mouse position on card)
   ================================================================ */
qsa('.g-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = ((e.clientX - left) / width)  * 100;
    const y = ((e.clientY - top)  / height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(56,189,248,0.06) 0%, rgba(17,24,39,0.7) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});