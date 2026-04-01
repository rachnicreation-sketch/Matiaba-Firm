/* ============================================
   RM5 PLURI-SERVICES — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------
     NAVBAR: scroll effect + active link + hamburger
  -------------------------------------------------- */
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-menu a');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const scrollTop = document.getElementById('scroll-top');

  // Scroll effects
  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // Navbar shadow
    navbar.classList.toggle('scrolled', y > 60);

    // Scroll-to-top button
    scrollTop.classList.toggle('visible', y > 400);

    // Active nav link based on scroll position
    let current = '';
    document.querySelectorAll('section[id], div[id]').forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Hamburger menu
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile nav on link click
  document.querySelectorAll('.nav-mobile a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Smooth scroll for all internal links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
        window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
      }
    });
  });

  // Scroll to top button
  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* -----------------------------------------------
     INTERSECTION OBSERVER — fade-up animations
  -------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* -----------------------------------------------
     COUNTER ANIMATION — hero stats
  -------------------------------------------------- */
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const isYear = target > 1000;

    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(eased * target);
      el.textContent = isYear ? current : (current < 10 ? '0' + current : current) + '+';

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = isYear ? target : target + '+';
    };

    requestAnimationFrame(update);
  }

  // Animate counters when hero stats come into view
  const statNums = document.querySelectorAll('.hero-stat-num[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  /* -----------------------------------------------
     CONTACT FORM — validation & submission
  -------------------------------------------------- */
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('.btn-submit');
      const name     = form.querySelector('#f-name').value.trim();
      const email    = form.querySelector('#f-email').value.trim();
      const service  = form.querySelector('#f-service').value;
      const subject  = form.querySelector('#f-subject').value.trim();
      const message  = form.querySelector('#f-message').value.trim();

      // Basic validation
      let valid = true;
      [form.querySelector('#f-name'), form.querySelector('#f-email'),
       form.querySelector('#f-subject'), form.querySelector('#f-message')].forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#E31E24';
          valid = false;
        } else {
          input.style.borderColor = '';
        }
      });

      // Email format
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        form.querySelector('#f-email').style.borderColor = '#E31E24';
        valid = false;
      }

      if (!valid) return;

      // Simulate submission
      btn.textContent = 'Envoi en cours...';
      btn.style.opacity = '0.7';
      btn.disabled = true;

      await new Promise(r => setTimeout(r, 1600));

      // Show success
      form.style.display = 'none';
      document.getElementById('form-success').style.display = 'block';
    });

    // Clear error on input
    form.querySelectorAll('.form-input, .form-select').forEach(input => {
      input.addEventListener('input', () => {
        input.style.borderColor = '';
      });
    });
  }

  /* -----------------------------------------------
     SERVICES CARDS — stagger reveal
  -------------------------------------------------- */
  const serviceCards = document.querySelectorAll('.service-card');
  const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        serviceObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  serviceCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, background 0.28s ease';
    serviceObserver.observe(card);
  });

  /* -----------------------------------------------
     TICKER — duplicate for seamless loop
  -------------------------------------------------- */
  const tickerTrack = document.querySelector('.ticker-track');
  if (tickerTrack) {
    const clone = tickerTrack.cloneNode(true);
    tickerTrack.parentElement.appendChild(clone);
  }

});
