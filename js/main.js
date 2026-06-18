/* ============================================================
   Francisco Travisany — CV Web · main.js
   ============================================================ */

'use strict';

/* ── NAVBAR SCROLL ── */
(function () {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ── MOBILE MENU ── */
(function () {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  const icon   = toggle.querySelector('.material-icons');

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    icon.textContent = open ? 'close' : 'menu';
  });

  // Close menu when a link is clicked
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      icon.textContent = 'menu';
    });
  });
})();

/* ── ACTIVE NAV LINK ON SCROLL ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        }
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );

  sections.forEach(s => observer.observe(s));
})();

/* ── TIMELINE SCROLL REVEAL ── */
(function () {
  const items = document.querySelectorAll('.timeline-item[data-aos]');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger each item slightly
          const delay = Array.from(items).indexOf(entry.target) * 120;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach(el => observer.observe(el));
})();

/* ── ABOUT CARDS REVEAL ── */
(function () {
  const cards = document.querySelectorAll('.about-card, .skill-block, .edu-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity .5s ease ${i * 70}ms, transform .5s ease ${i * 70}ms`;
    observer.observe(card);
  });
})();

/* ── LANGUAGE BAR ANIMATION ── */
(function () {
  const fills = document.querySelectorAll('.lang-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target.style.width;
          entry.target.style.width = '0%';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              entry.target.style.width = target;
            });
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  fills.forEach(f => observer.observe(f));
})();

/* ── CONTACT FORM VALIDATION ── */
(function () {
  const form    = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  if (!form) return;

  const fields = {
    firstName : { el: document.getElementById('firstName'), label: 'nombre' },
    lastName  : { el: document.getElementById('lastName'),  label: 'apellido' },
    email     : { el: document.getElementById('email'),     label: 'email' },
    message   : { el: document.getElementById('message'),   label: 'mensaje' },
  };

  function validate () {
    let valid = true;
    clearErrors();

    // Required non-empty
    ['firstName', 'lastName', 'message'].forEach(key => {
      const f = fields[key];
      if (!f.el.value.trim()) {
        markError(f.el, `Por favor ingresa tu ${f.label}.`);
        valid = false;
      }
    });

    // Email format
    const emailVal = fields.email.el.value.trim();
    if (!emailVal) {
      markError(fields.email.el, 'Por favor ingresa tu email.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      markError(fields.email.el, 'Por favor ingresa un email válido.');
      valid = false;
    }

    return valid;
  }

  function markError (el, msg) {
    el.classList.add('error');
    el.setAttribute('aria-invalid', 'true');
    const hint = el.parentElement.querySelector('.field-hint');
    if (!hint) {
      const div = document.createElement('div');
      div.className = 'field-hint';
      div.style.cssText = 'font-size:.78rem;color:#e53e3e;margin-top:3px;';
      div.textContent = msg;
      el.parentElement.appendChild(div);
    }
  }

  function clearErrors () {
    Object.values(fields).forEach(f => {
      f.el.classList.remove('error');
      f.el.removeAttribute('aria-invalid');
      const hint = f.el.parentElement.querySelector('.field-hint');
      if (hint) hint.remove();
    });
    formMsg.textContent = '';
    formMsg.className = 'form-msg';
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate send (replace with mailto or actual backend)
    const btn = form.querySelector('.btn-submit');
    btn.disabled = true;
    btn.innerHTML = '<span class="material-icons" style="animation:spin .8s linear infinite">autorenew</span> Enviando…';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<span class="material-icons">send</span> Enviar mensaje';
      formMsg.textContent = '✓ Mensaje enviado. ¡Gracias por contactarme!';
      formMsg.className = 'form-msg success';
      form.reset();

      // You can replace the setTimeout above with a real fetch to a backend,
      // Formspree, EmailJS, etc.
    }, 1400);
  });

  // Clear error on input
  Object.values(fields).forEach(f => {
    f.el.addEventListener('input', () => {
      f.el.classList.remove('error');
      const hint = f.el.parentElement.querySelector('.field-hint');
      if (hint) hint.remove();
    });
  });
})();

/* ── SPINNING ICON KEYFRAME (inject once) ── */
(function () {
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
})();

/* ── SMOOTH SCROLL OFFSET for fixed navbar ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
