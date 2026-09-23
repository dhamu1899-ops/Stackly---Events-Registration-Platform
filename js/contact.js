/**
 * Stackly PRD Compliant Contact Form & Validation Controller
 * Enforces client-side validation, warnings, tooltips,
 * prevents invalid submission or 404 redirects (PRD Pages 28-29).
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const phoneInput = document.getElementById('contact-phone');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const successBanner = document.getElementById('contact-success-banner');

    function showError(inputElement, message) {
      const group = inputElement.closest('.form-group');
      if (!group) return;
      group.classList.add('has-error');
      
      let tooltip = group.querySelector('.field-warning-tooltip');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'field-warning-tooltip';
        tooltip.innerHTML = `<span class="icon">!</span> <span class="tooltip-text">${message}</span>`;
        group.appendChild(tooltip);
      } else {
        const textSpan = tooltip.querySelector('.tooltip-text');
        if (textSpan) textSpan.textContent = message;
      }
    }

    function clearError(inputElement) {
      const group = inputElement.closest('.form-group');
      if (!group) return;
      group.classList.remove('has-error');
    }

    function validateEmail(email) {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
      if (!phone) return true; // Optional field
      const re = /^[+]?[\d\s-]{8,15}$/;
      return re.test(String(phone).trim());
    }

    // Live clear error on typing
    [nameInput, emailInput, phoneInput, subjectInput, messageInput].forEach((input) => {
      if (!input) return;
      input.addEventListener('input', () => {
        clearError(input);
        if (successBanner) successBanner.classList.remove('active');
      });
    });

    // Submit listener with strict validation
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Stop any default redirect or page reload

      let isValid = true;
      let firstInvalidInput = null;

      // Validate Name
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Please fill in this field.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      } else {
        clearError(nameInput);
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Please fill in this field.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else {
        clearError(emailInput);
      }

      // Validate Mobile Number (Optional, but if given must be valid)
      if (phoneInput && phoneInput.value.trim() && !validatePhone(phoneInput.value.trim())) {
        showError(phoneInput, 'Please enter a valid phone number.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = phoneInput;
      } else if (phoneInput) {
        clearError(phoneInput);
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        showError(subjectInput, 'Please fill in this field.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = subjectInput;
      } else {
        clearError(subjectInput);
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        showError(messageInput, 'Please fill in this field.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = messageInput;
      } else {
        clearError(messageInput);
      }

      if (!isValid) {
        firstInvalidInput?.focus();
        return;
      }

      // All Valid: Display positive feedback
      if (successBanner) {
        successBanner.classList.add('active');
      }

      // Reset fields
      contactForm.reset();
    });

    // FAQ Accordion Interactivity
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach((q) => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        if (item) {
          const wasActive = item.classList.contains('active');
          document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('active'));
          if (!wasActive) {
            item.classList.add('active');
          }
        }
      });
    });
  });
})();
