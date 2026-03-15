/* ============================================================
   THEME TOGGLE
   ============================================================ */
(function initTheme() {
  const html = document.documentElement;
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  html.setAttribute('data-theme', theme);
})();

function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
}

document.addEventListener('DOMContentLoaded', function () {
  const html = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const currentTheme = html.getAttribute('data-theme') || 'light';
  updateThemeIcon(currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(next);
    });
  }

  /* ============================================================
     HAMBURGER MENU
     ============================================================ */
  const hamburger = document.getElementById('navHamburger');
  const mobileNav = document.getElementById('navMobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ============================================================
     SCROLL REVEAL (Intersection Observer)
     ============================================================ */
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ============================================================
     SKILL BARS (triggered by reveal visible class)
     ============================================================ */
  // skill-fill animation is CSS-driven when parent gets .visible
  // We watch each .skill-category separately
  const skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-category').forEach(function (el) {
    skillObserver.observe(el);
  });

  /* ============================================================
     COUNT-UP ANIMATION
     ============================================================ */
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCount(el) {
    const rawTarget = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    // Determine display format
    // For large numbers like 550000 → display as "55" with suffix "万"
    // For 1500000 → display as "150" with suffix "万"
    // For 41 (target=41, decimals=1) → display as "4.1"
    // For 245 (target=245, decimals=1) → display as "24.5"
    // For 586362 → display as "586,362"

    let displayTarget;
    let formatFn;

    if (suffix === '万') {
      displayTarget = rawTarget / 10000;
      formatFn = function (val) {
        return Math.floor(val) + suffix;
      };
    } else if (decimals > 0) {
      // target is already * 10^decimals, need to divide
      displayTarget = rawTarget / Math.pow(10, decimals);
      formatFn = function (val) {
        return val.toFixed(1);
      };
    } else {
      displayTarget = rawTarget;
      formatFn = function (val) {
        return Math.round(val).toLocaleString('ja-JP');
      };
    }

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);
      const current = displayTarget * easedProgress;
      el.textContent = formatFn(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatFn(displayTarget);
      }
    }

    requestAnimationFrame(step);
  }

  const countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (!el.dataset.animated) {
          el.dataset.animated = 'true';
          animateCount(el);
        }
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.count-up').forEach(function (el) {
    countObserver.observe(el);
  });

  /* ============================================================
     3D TILT + CURSOR SPOTLIGHT (Cards)
     ============================================================ */
  var tiltTargets = document.querySelectorAll(
    '.work-card, .service-card, .kpi-card, .media-card'
  );

  if (!('ontouchstart' in window)) {
    tiltTargets.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var cx = rect.width / 2;
        var cy = rect.height / 2;
        var rotX = ((y - cy) / cy) * -5;
        var rotY = ((x - cx) / cx) * 5;
        card.style.transform =
          'perspective(700px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(1.02)';
        card.style.setProperty('--cx', ((x / rect.width) * 100) + '%');
        card.style.setProperty('--cy', ((y / rect.height) * 100) + '%');
      });

      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        card.style.transform = '';
        setTimeout(function () { card.style.transition = ''; }, 620);
      });
    });
  }

  /* ============================================================
     TIMELINE LINE DRAW
     ============================================================ */
  var timelineObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('line-drawn');
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.about-timeline-wrap').forEach(function (el) {
    timelineObserver.observe(el);
  });

  /* ============================================================
     TECH CHIPS STAGGERED POP-IN
     ============================================================ */
  var chipObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.tech-chip').forEach(function (chip, i) {
          chip.style.setProperty('--chip-i', i);
          chip.classList.add('chip-pop');
        });
        chipObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.tech-chips').forEach(function (el) {
    chipObserver.observe(el);
  });

  /* ============================================================
     TYPEWRITER EFFECT (Hero tagline)
     ============================================================ */
  const typewriterTarget = document.getElementById('typewriterTarget');
  if (typewriterTarget) {
    const phrases = [
      'AI × エンジニア × コンテンツクリエイター',
      'フルスタック開発 × SEO × アプリケーション',
      '慶應大在学中 × テクノフィア代表',
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    // Create cursor
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    typewriterTarget.textContent = '';
    typewriterTarget.appendChild(cursor);

    function type() {
      if (isPaused) return;

      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        charIndex++;
        typewriterTarget.textContent = currentPhrase.slice(0, charIndex);
        typewriterTarget.appendChild(cursor);

        if (charIndex === currentPhrase.length) {
          isPaused = true;
          setTimeout(function () {
            isPaused = false;
            isDeleting = true;
            type();
          }, 2400);
          return;
        }
        setTimeout(type, 60);
      } else {
        charIndex--;
        typewriterTarget.textContent = currentPhrase.slice(0, charIndex);
        typewriterTarget.appendChild(cursor);

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 30);
      }
    }

    // Start after a short delay so reveal animation finishes
    setTimeout(type, 800);
  }

  /* ============================================================
     SMOOTH ACTIVE NAV HIGHLIGHT
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

  const navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          const href = link.getAttribute('href');
          if (href === '#' + id) {
            link.style.color = 'var(--accent)';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(function (section) {
    navObserver.observe(section);
  });

  /* ============================================================
     OS THEME CHANGE LISTENER
     ============================================================ */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('theme')) {
      const next = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      updateThemeIcon(next);
    }
  });
});
