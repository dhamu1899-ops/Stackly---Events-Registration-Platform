/**
 * Stackly Theme - Global Helpers & Interactions
 * Newsletter subscription feedback, 404 search box, smooth scrolling
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Newsletter form in footer
    const newsletterForms = document.querySelectorAll('.footer-newsletter-form');
    newsletterForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        if (input && input.value.trim()) {
          const originalBtn = form.querySelector('button');
          if (originalBtn) {
            const originalText = originalBtn.textContent;
            originalBtn.textContent = 'Subscribed!';
            originalBtn.style.backgroundColor = '#4cd964';
            input.value = '';
            setTimeout(() => {
              originalBtn.textContent = originalText;
              originalBtn.style.backgroundColor = '';
            }, 3000);
          }
        }
      });
    });

    // 404 Page Search Bar
    const errorSearchBtn = document.getElementById('error-search-btn');
    const errorSearchInput = document.getElementById('error-search-input');
    function execute404Search() {
      if (errorSearchInput && errorSearchInput.value.trim()) {
        window.location.href = `events.html?search=${encodeURIComponent(errorSearchInput.value.trim())}`;
      }
    }
    errorSearchBtn?.addEventListener('click', execute404Search);
    errorSearchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        execute404Search();
      }
    });
  });
})();
