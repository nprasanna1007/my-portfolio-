/* ═══════════════════════════════════════════════════════════
   PORTFOLIO.JS — Interactive Behaviors & Animations
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────── LOADER ──────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initAnimations();
  }, 2200);
});

/* ──────────────── CURSOR ──────────────── */
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

document.addEventListener('mousemove', e => {
  if (!cursorDot || !cursorRing) return;
  cursorDot.style.left  = e.clientX + 'px';
  cursorDot.style.top   = e.clientY + 'px';
  // Slight lag for ring
  requestAnimationFrame(() => {
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top  = e.clientY + 'px';
  });
});

document.addEventListener('mousedown', () => cursorDot && cursorDot.style.setProperty('transform', 'translate(-50%,-50%) scale(0.6)'));
document.addEventListener('mouseup',   () => cursorDot && cursorDot.style.setProperty('transform', 'translate(-50%,-50%) scale(1)'));

/* ──────────────── NAVBAR SCROLL & ACTIVE ──────────────── */
const navbar       = document.getElementById('navbar');
const scrollProg   = document.getElementById('scrollProgress');
const backToTop    = document.getElementById('backToTop');
const sections     = document.querySelectorAll('section[id]');
const navLinks     = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  const scrollY   = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  // Navbar style
  navbar.classList.toggle('scrolled', scrollY > 30);

  // Scroll progress bar
  scrollProg.style.width = ((scrollY / docHeight) * 100) + '%';

  // Back to top
  backToTop.classList.toggle('visible', scrollY > 500);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });

  // Reveal on scroll
  revealElements();
});

/* ──────────────── HAMBURGER MENU ──────────────── */
const hamburger  = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});

navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

/* ──────────────── SMOOTH SCROLL ──────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ──────────────── BACK TO TOP ──────────────── */
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ──────────────── TYPEWRITER ──────────────── */
const roles = [
  'Full-Stack Developer',
  'UI/UX Designer',
  'AI/ML Enthusiast',
  'Problem Solver',
  'Open Source Contributor',
  'Creative Coder'
];
let roleIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function typeLoop() {
  if (!typeEl) return;
  const role = roles[roleIdx];
  if (!deleting) {
    typeEl.textContent = role.slice(0, ++charIdx);
    if (charIdx === role.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typeEl.textContent = role.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 60 : 100);
}
setTimeout(typeLoop, 1000);

/* ──────────────── REVEAL ON SCROLL ──────────────── */
function revealElements() {
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  reveals.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80 && !el.classList.contains('visible')) {
      const delay = el.classList.contains('reveal-stagger') ? i * 60 : 0;
      setTimeout(() => {
        el.classList.add('visible');
        // Trigger skill bars inside this element
        el.querySelectorAll('.skill-fill').forEach(bar => animateSkillBar(bar));
      }, delay);
    }
  });
}

/* ──────────────── SKILL BARS ──────────────── */
function animateSkillBar(bar) {
  const w = bar.dataset.width || '0';
  bar.style.width = w + '%';
}

/* ──────────────── SKILL TABS ──────────────── */
document.querySelectorAll('.skill-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const panelId = 'tab-' + tab.dataset.tab;

    document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.skill-panel').forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    const panel = document.getElementById(panelId);
    panel.classList.add('active');

    // Animate bars that just appeared
    panel.querySelectorAll('.skill-fill').forEach(animateSkillBar);

    // Re-run stagger reveal for new panel items
    panel.querySelectorAll('.reveal-stagger').forEach((el, i) => {
      el.classList.remove('visible');
      setTimeout(() => el.classList.add('visible'), i * 80);
    });
  });
});

/* ──────────────── PROJECT FILTER ──────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.transition = 'opacity 0.35s, transform 0.35s';
      if (match) {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        card.classList.remove('hidden');
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => card.classList.add('hidden'), 350);
      }
    });
  });
});

/* ──────────────── CONTACT FORM ──────────────── */
const contactForm   = document.getElementById('contactForm');
const formSuccess   = document.getElementById('formSuccess');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type=submit]');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.disabled = false;
    formSuccess.classList.add('show');
    contactForm.reset();
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1800);
});

/* ──────────────── DOWNLOAD RESUME BUTTON ──────────────── */
document.getElementById('downloadResume')?.addEventListener('click', e => {
  e.preventDefault();
  // In a real deployment, replace this with actual PDF URL
  alert('📄 Resume PDF would download here in production!\n\nReplace this handler with your actual PDF file link.');
});

/* ──────────────── PARTICLES CANVAS ──────────────── */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  canvas.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;';
  container.appendChild(canvas);

  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = container.offsetWidth;
    H = canvas.height = container.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168,85,247,${this.alpha})`;
      ctx.fill();
    }
  }

  const COUNT = Math.min(120, Math.floor((W * H) / 8000));
  particles = Array.from({ length: COUNT }, () => new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${0.12 * (1 - dist/120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
}

/* ──────────────── INIT ──────────────── */
function initAnimations() {
  initParticles();
  revealElements();

  // Animate all visible skill bars immediately
  document.querySelectorAll('#tab-languages .skill-fill').forEach(animateSkillBar);

  // Stagger hero section elements
  document.querySelectorAll('.hero-section .reveal-stagger').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 100);
  });
}

/* ──────────────── TILT EFFECT ON PROJECT CARDS ──────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = (e.clientX - rect.left) / rect.width  - 0.5;
    const y      = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y*8}deg) rotateY(${x*8}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease, border-color 0.35s, box-shadow 0.35s';
  });
});

/* ──────────────── NUMBER COUNTER ANIMATION ──────────────── */
function animateCounter(el) {
  const target = parseInt(el.textContent);
  const suffix = el.textContent.replace(target, '');
  let current  = 0;
  const step   = Math.ceil(target / 40);
  const timer  = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, 40);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.about-stats').forEach(el => counterObserver.observe(el));

/* ──────────────── NAVBAR LINK HOVER RIPPLE ──────────────── */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('mouseenter', () => link.style.color = '');
});

/* ──────────────── ACTIVE SECTION HIGHLIGHT ──────────────── */
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(sec => sectionObserver.observe(sec));

/* ──────────────── CONTACT FORM LIVE VALIDATION ──────────────── */
document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
  field.addEventListener('blur', () => {
    const isValid = field.checkValidity();
    field.style.borderColor = field.value
      ? (isValid ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)')
      : '';
  });
  field.addEventListener('focus', () => field.style.borderColor = '');
});
