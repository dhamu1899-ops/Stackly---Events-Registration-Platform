/**
 * Stackly PRD Compliant Navbar & Mobile Drawer Controller
 * - 100% Full-width sticky behavior
 * - Mobile Drawer matching PRD Image 1
 * - Scroll locking to prevent underlying page movement
 * - Dropdown interactions and accessibility
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const drawerAccordions = document.querySelectorAll('.drawer-accordion-btn');
    const siteHeader = document.querySelector('.site-header');

    let scrollPosition = 0;

    // Scroll locking function (PRD Requirement 6, Page 17)
    function lockScroll() {
      scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      document.body.classList.add('menu-open');
      document.body.style.top = `-${scrollPosition}px`;
    }

    function unlockScroll() {
      document.body.classList.remove('menu-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollPosition);
    }

    // Open Mobile Drawer
    function openDrawer() {
      if (!mobileDrawer || !mobileOverlay) return;
      mobileOverlay.classList.add('active');
      mobileDrawer.classList.add('active');
      lockScroll();
      hamburgerBtn?.setAttribute('aria-expanded', 'true');
    }

    // Close Mobile Drawer
    function closeDrawer() {
      if (!mobileDrawer || !mobileOverlay) return;
      mobileOverlay.classList.remove('active');
      mobileDrawer.classList.remove('active');
      unlockScroll();
      hamburgerBtn?.setAttribute('aria-expanded', 'false');
    }

    // Event Listeners
    hamburgerBtn?.addEventListener('click', openDrawer);
    drawerCloseBtn?.addEventListener('click', closeDrawer);
    mobileOverlay?.addEventListener('click', closeDrawer);

    // Close on Escape Key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer?.classList.contains('active')) {
        closeDrawer();
      }
    });

    // Sub-menu accordion in mobile drawer
    drawerAccordions.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const submenu = document.getElementById(targetId);
        if (submenu) {
          const isOpen = submenu.classList.toggle('open');
          btn.textContent = isOpen ? '▲' : '▼';
        }
      });
    });

    // Sticky header elevation on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        siteHeader?.classList.add('header-scrolled');
      } else {
        siteHeader?.classList.remove('header-scrolled');
      }
    }, { passive: true });

    // Drawer Search Handler
    const drawerSearchForm = document.getElementById('drawer-search-form');
    drawerSearchForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = drawerSearchForm.querySelector('input');
      const query = input?.value.trim();
      if (query) {
        window.location.href = `events.html?search=${encodeURIComponent(query)}`;
      }
    });
  });
})();
