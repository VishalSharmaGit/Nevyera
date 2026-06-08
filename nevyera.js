/* ═══════════════════════════════════════════
   NEVYERA — nevyera.js
   All Interactions & Animations
═══════════════════════════════════════════ */

'use strict';

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initHamburger();
  initSmoothScroll();
  initScrollReveal();
  initCounters();
  initPortfolioFilter();
  initTestimonials();
  initContactForm();
  initActiveNavLink();
  initParallaxOrbs();
});

/* ════════════════════════════════════════
   1. CUSTOM CURSOR
════════════════════════════════════════ */
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower with RAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Scale on interactive elements
  const interactives = document.querySelectorAll('a, button, .filter-btn, .service-card, .portfolio-card, .testi-dots .dot');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width   = '16px';
      cursor.style.height  = '16px';
      cursor.style.background = 'var(--purple)';
      follower.style.width  = '56px';
      follower.style.height = '56px';
      follower.style.borderColor = 'rgba(139,92,246,0.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width   = '10px';
      cursor.style.height  = '10px';
      cursor.style.background = 'var(--blue)';
      follower.style.width  = '36px';
      follower.style.height = '36px';
      follower.style.borderColor = 'rgba(59,130,246,0.5)';
    });
  });

  // Hide on leave, show on enter
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; follower.style.opacity = '1'; });
}

/* ════════════════════════════════════════
   2. NAVBAR — SCROLL GLASS EFFECT
════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ════════════════════════════════════════
   3. HAMBURGER MENU
════════════════════════════════════════ */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    const isOpen = navLinks.classList.contains('open');
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity   = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });

  // Close on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = ''; s.style.opacity = '1';
      });
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = ''; s.style.opacity = '1';
      });
    }
  });
}

/* ════════════════════════════════════════
   4. SMOOTH SCROLL
════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ════════════════════════════════════════
   5. SCROLL REVEAL (IntersectionObserver)
════════════════════════════════════════ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for grid items
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════
   6. COUNTER ANIMATION
════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step     = 16;
  const steps    = duration / step;
  const increment = target / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, step);
}

/* ════════════════════════════════════════
   7. PORTFOLIO FILTER
════════════════════════════════════════ */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.portfolio-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.style.opacity    = '0';
          card.style.transform  = 'scale(0.95)';
          card.style.display    = 'block';
          // Reflow
          card.getBoundingClientRect();
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity    = '1';
          card.style.transform  = 'scale(1)';
        } else {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity    = '0';
          card.style.transform  = 'scale(0.9)';
          setTimeout(() => {
            if (btn.dataset.filter !== 'all' && card.dataset.category !== btn.dataset.filter) {
              card.style.display = 'none';
            }
          }, 350);
        }
      });
    });
  });
}

/* ════════════════════════════════════════
   8. TESTIMONIAL SLIDER
════════════════════════════════════════ */
function initTestimonials() {
  const track  = document.getElementById('testiTrack');
  const dots   = document.querySelectorAll('.testi-dots .dot');
  if (!track || !dots.length) return;

  let current = 0;
  let timer   = null;

  function goTo(index) {
    current = index;
    track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    track.style.transform  = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function next() {
    goTo((current + 1) % dots.length);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(parseInt(dot.dataset.index, 10));
      startAuto();
    });
  });

  function startAuto() {
    timer = setInterval(next, 5000);
  }

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      clearInterval(timer);
      goTo(dx < 0 ? (current + 1) % dots.length : (current - 1 + dots.length) % dots.length);
      startAuto();
    }
  });

  startAuto();
}

/* ════════════════════════════════════════
   9. CONTACT FORM
════════════════════════════════════════ */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('.btn-primary');
    const original = btn.innerHTML;

    // Loading state
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    btn.disabled  = true;
    btn.style.opacity = '0.7';

    // Simulate async (replace with real API call)
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled  = false;
      btn.style.opacity = '1';
      success.classList.add('show');
      form.reset();

      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1800);
  });

  // Input focus micro-animations
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.style.transform = 'scale(1.01)';
    });
    input.addEventListener('blur', () => {
      input.parentElement.style.transform = '';
    });
  });
}

/* ════════════════════════════════════════
   10. ACTIVE NAV LINK ON SCROLL
════════════════════════════════════════ */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));
}

/* ════════════════════════════════════════
   11. PARALLAX ORBS ON MOUSE MOVE
════════════════════════════════════════ */
function initParallaxOrbs() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 30;
    targetY = (e.clientY / window.innerHeight - 0.5) * 30;
  }, { passive: true });

  function animateOrbs() {
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 0.4;
      orb.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
    });

    requestAnimationFrame(animateOrbs);
  }
  animateOrbs();
}

/* ════════════════════════════════════════
   12. FLOATING CARDS MOUSE TILT
════════════════════════════════════════ */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const centerX = rect.left + rect.width  / 2;
    const centerY = rect.top  + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -5;
    const rotateY = ((e.clientX - centerX) / (rect.width  / 2)) *  5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ════════════════════════════════════════
   13. TYPING EFFECT — Hero Badge
════════════════════════════════════════ */
(function initTyping() {
  const codeLines = document.querySelectorAll('.code-line');
  if (!codeLines.length) return;

  codeLines.forEach((line, i) => {
    line.style.opacity = '0';
    setTimeout(() => {
      line.style.transition = 'opacity 0.4s ease';
      line.style.opacity    = '1';
    }, 800 + i * 500);
  });
})();

/* ════════════════════════════════════════
   14. SCROLL PROGRESS BAR
════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; z-index: 9999;
    height: 3px; width: 0%; background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    transition: width 0.1s linear; pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = Math.min(100, (scrolled / total) * 100);
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ════════════════════════════════════════
   15. PORTFOLIO CARD HOVER GLOW
════════════════════════════════════════ */
document.querySelectorAll('.portfolio-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(59,130,246,0.08) 0%, rgba(255,255,255,0.03) 60%)`;
    card.style.borderColor = 'rgba(59,130,246,0.3)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.background   = '';
    card.style.borderColor  = '';
  });
});
