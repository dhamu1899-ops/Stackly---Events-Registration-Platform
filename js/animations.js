/**
 * Stackly Theme - High Performance Scroll Animation Engine v4
 * IntersectionObserver + Passive Scroll Listener dual-engine
 * Guarantees smooth, reliable section and card reveal effects across all browsers
 */

(function () {
  'use strict';

  const SELECTOR = [
    'section[data-animate]',
    '[data-animate]',
    '[data-stagger]',
    '.event-card',
    '.venue-card',
    '.venue-status-card',
    '.bento-card',
    '.team-card',
    '.blog-card',
    '.service-card',
    '.value-card',
    '.milestone-item',
    '.counter-box',
    '.stat-box',
    '.kpi-card',
    '.testimonial-card',
    '.gallery-item',
    '.perk-card',
    '.timeline-card'
  ].join(', ');

  let elements = [];
  let observer = null;
  let ticking = false;

  function revealElement(target) {
    if (!target.classList.contains('is-visible')) {
      target.classList.add('is-visible');
      if (observer) {
        try { observer.unobserve(target); } catch (e) {}
      }

      // If target is a section or container, cascade to any child cards with smooth stagger
      const children = target.querySelectorAll(
        '.event-card, .venue-card, .venue-status-card, .bento-card, .team-card, .blog-card, ' +
        '.service-card, .value-card, .milestone-item, .counter-box, .stat-box, .kpi-card, ' +
        '.testimonial-card, .gallery-item, .perk-card, .timeline-card'
      );
      if (children.length) {
        children.forEach((c, idx) => {
          setTimeout(() => {
            c.classList.add('is-visible');
            if (observer) {
              try { observer.unobserve(c); } catch (e) {}
            }
          }, idx * 70);
        });
      }
    }
  }

  function initElements() {
    elements = Array.from(document.querySelectorAll(SELECTOR));

    // Immediately show hero sections and first elements so screen is never blank
    document.querySelectorAll('.hero-section, .about-hero, .events-hero-wrapper, .team-hero, .blog-hero, .contact-hero, section:first-of-type').forEach(el => {
      el.classList.add('is-visible');
    });

    if ('IntersectionObserver' in window) {
      if (observer) observer.disconnect();

      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            revealElement(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.05
      });

      elements.forEach(el => {
        if (!el.classList.contains('is-visible')) {
          observer.observe(el);
        }
      });
    }

    checkVisible();
  }

  // Fast viewport check fallback for scroll events
  function checkVisible() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const triggerBottom = vh - 20;

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (!el.classList.contains('is-visible')) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerBottom && rect.bottom >= 0) {
          revealElement(el);
        }
      }
    }
  }

  function onScroll() {
    updateProgressBar();

    if (!ticking) {
      window.requestAnimationFrame(() => {
        checkVisible();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Gold scroll progress bar at top of window
  let progressBar = null;
  function updateProgressBar() {
    if (!progressBar) {
      progressBar = document.getElementById('scroll-progress-bar');
      if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress-bar';
        document.body.prepend(progressBar);
      }
    }
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
    if (docHeight > 0) {
      const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      progressBar.style.width = pct + '%';
    }
  }

  // Animated number counters
  function initCounters() {
    const counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count-to'), 10);
        const suffix = el.getAttribute('data-count-suffix') || '';
        const duration = parseInt(el.getAttribute('data-count-duration') || '1800', 10);
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) {
            el.textContent = target.toLocaleString('en-IN') + suffix;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(start).toLocaleString('en-IN') + suffix;
          }
        }, 16);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.2 });

    counters.forEach(el => countObserver.observe(el));
  }

  function start() {
    initElements();
    initCounters();
    updateProgressBar();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', checkVisible, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  // Also re-check when page finishes full load and after loader dismissal
  window.addEventListener('load', () => {
    setTimeout(checkVisible, 100);
    setTimeout(checkVisible, 500);
  });

  window.addEventListener('stacklyLoaderHidden', () => {
    setTimeout(checkVisible, 50);
  });
})();
