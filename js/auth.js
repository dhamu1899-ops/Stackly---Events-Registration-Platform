/**
 * Stackly Theme - Luxury Role-Based Authentication & Session Controller
 * Manages Client/User & Admin/Organizer Authentication, Registration, and Dashboards
 * Supports dynamic username extraction from email (e.g. dhamu123@gmail.com -> Dhamu123)
 */

(function () {
  'use strict';

  // Demo Accounts
  const DEMO_USERS = [
    {
      id: 'usr-client-01',
      name: 'Ananya Sharma',
      email: 'client@stackly.com',
      password: 'client123',
      role: 'user',
      phone: '+91 98765 12345',
      interest: 'wedding',
      tier: 'VIP Gold Host',
      avatarInitial: 'A'
    },
    {
      id: 'usr-admin-01',
      name: 'Vikramaditya Roy',
      email: 'admin@stackly.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98765 99999',
      interest: 'management',
      tier: 'Chief Event Marshal',
      avatarInitial: 'V'
    }
  ];

  let _memoryUser = null;

  // Extract clean username from email (e.g. dhamu123@gmail.com -> Dhamu123)
  function formatUsernameFromEmail(email) {
    if (!email) return 'Celebration Host';
    const prefix = email.split('@')[0];
    if (!prefix) return 'Celebration Host';

    // If email has separators like john.doe or ananya_sharma
    if (prefix.includes('.') || prefix.includes('_') || prefix.includes('-')) {
      return prefix
        .split(/[._-]+/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }
    // Single alphanumeric like dhamu123 -> Dhamu123
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }

  // Initialize LocalStorage users
  function initUsers() {
    try {
      if (!localStorage.getItem('stackly_registered_users')) {
        localStorage.setItem('stackly_registered_users', JSON.stringify(DEMO_USERS));
      }
    } catch (e) {
      console.warn('localStorage access limited:', e);
    }
  }

  function getRegisteredUsers() {
    initUsers();
    try {
      const stored = localStorage.getItem('stackly_registered_users');
      return stored ? JSON.parse(stored) : DEMO_USERS;
    } catch (e) {
      return DEMO_USERS;
    }
  }

  function getCurrentUser() {
    try {
      const u = localStorage.getItem('stackly_current_user') || sessionStorage.getItem('stackly_current_user');
      if (u) return JSON.parse(u);
    } catch (e) {}
    return _memoryUser;
  }

  function setCurrentUser(user) {
    _memoryUser = user;
    try {
      localStorage.setItem('stackly_current_user', JSON.stringify(user));
      localStorage.setItem('stackly_auth_user', JSON.stringify(user));
    } catch (e) {}
    try {
      sessionStorage.setItem('stackly_current_user', JSON.stringify(user));
      sessionStorage.setItem('stackly_auth_user', JSON.stringify(user));
    } catch (e) {}
  }

  function clearCurrentUser() {
    _memoryUser = null;
    try {
      localStorage.removeItem('stackly_current_user');
      localStorage.removeItem('stackly_auth_user');
    } catch (e) {}
    try {
      sessionStorage.removeItem('stackly_current_user');
      sessionStorage.removeItem('stackly_auth_user');
    } catch (e) {}
  }

  function navigateToDashboard(role) {
    const dest = (role === 'admin') ? 'dashboard-admin.html' : 'dashboard-user.html';
    try {
      window.location.assign(dest);
    } catch (e) {
      window.location.href = dest;
    }
  }

  // Logout: ALWAYS navigate to home page (index.html)
  function logout() {
    clearCurrentUser();
    try {
      window.location.assign('index.html');
    } catch (err) {
      window.location.href = 'index.html';
    }
  }

  // Email Format Validator (RFC 5322 Compliant Client Pattern)
  function isValidEmail(email) {
    if (!email) return false;
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).trim());
  }

  // Register: saves user, but navigates to login.html
  // Enforces role: 'user' for public registration (ERP-001) & email validation (ERP-005)
  function registerUser(userData) {
    const users = getRegisteredUsers();
    const cleanEmail = (userData.email || '').trim().toLowerCase();

    // ERP-005: Reject malformed email
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email address (e.g. name@domain.com).' };
    }

    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'An account with this email already exists. Please log in.' };
    }

    // ERP-001: Public signup flow strictly creates 'user' (Celebration Host) accounts
    const newUser = {
      id: 'usr-' + Date.now(),
      name: userData.name || formatUsernameFromEmail(cleanEmail),
      email: cleanEmail,
      password: userData.password,
      role: 'user', // strictly Client / User
      phone: userData.phone || '',
      interest: userData.interest || 'wedding',
      tier: 'VIP Client Host',
      avatarInitial: (userData.name || cleanEmail).charAt(0).toUpperCase()
    };

    users.push(newUser);
    try {
      localStorage.setItem('stackly_registered_users', JSON.stringify(users));
    } catch (e) {}

    return { success: true, user: newUser };
  }

  // Authenticate user
  // ERP-002: Rejects unknown credentials, requires registration first
  function authenticateUser(email, password, selectedRole) {
    const users = getRegisteredUsers();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanEmail) {
      return { success: false, message: 'Please enter your account email.' };
    }

    if (!isValidEmail(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email address (e.g. name@domain.com).' };
    }

    if (!cleanPass) {
      return { success: false, message: 'Please enter your password.' };
    }

    // ERP-002: Look up registered account; reject if not found
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { 
        success: false, 
        message: 'No account found with this email. Please register first.' 
      };
    }

    // Verify password
    if (found.password !== cleanPass) {
      return { 
        success: false, 
        message: 'Incorrect password. Please verify and try again.' 
      };
    }

    // If logging into Admin Portal tab, verify administrator privileges
    if (selectedRole === 'admin' && found.role !== 'admin') {
      return { 
        success: false, 
        message: 'Access Denied: This account does not possess administrator privileges. Please switch to the Client Portal tab.' 
      };
    }

    setCurrentUser(found);
    return { success: true, user: found };
  }

  // Update Header/Navbar state across all pages
  function syncNavbarState() {
    const user = getCurrentUser();
    const loginBtns = document.querySelectorAll('.btn-login');

    loginBtns.forEach(btn => {
      if (user) {
        const dest = user.role === 'admin' ? 'dashboard-admin.html' : 'dashboard-user.html';
        btn.href = dest;
        btn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>${user.name.split(' ')[0]} (${user.role === 'admin' ? 'Admin' : 'Portal'})</span>
        `;
        btn.setAttribute('title', `Go to ${user.role === 'admin' ? 'Admin' : 'Client'} Dashboard`);
      } else {
        btn.href = 'login.html';
        btn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
          <span>Login</span>
        `;
        btn.setAttribute('title', 'Login to Client or Admin Portal');
      }
    });

    const logoutBtns = document.querySelectorAll('.drawer-logout-btn');
    logoutBtns.forEach(b => {
      b.style.display = user ? 'inline-flex' : 'none';
    });
  }

  // Tooltip Helper
  function showFieldTooltip(input, message) {
    removeFieldTooltip(input);
    input.classList.add('has-error');

    const tooltip = document.createElement('div');
    tooltip.className = 'stackly-form-tooltip';
    tooltip.textContent = `! ${message}`;
    
    const parent = input.parentElement;
    parent.style.position = 'relative';
    parent.appendChild(tooltip);

    setTimeout(() => {
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateY(0)';
    }, 10);

    input.focus();
  }

  function removeFieldTooltip(input) {
    input.classList.remove('has-error');
    const parent = input.parentElement;
    const existing = parent.querySelector('.stackly-form-tooltip');
    if (existing) existing.remove();
  }

  // Page Specific Handlers
  document.addEventListener('DOMContentLoaded', () => {
    initUsers();
    syncNavbarState();

    // 1. LOGIN PAGE LOGIC
    const loginForm = document.getElementById('stackly-login-form');
    if (loginForm) {
      let activeRole = 'user';
      const roleTabs = document.querySelectorAll('.role-tab-btn');
      const emailInput = document.getElementById('login-email');
      const passwordInput = document.getElementById('login-password');
      const alertBox = document.getElementById('login-alert-box');
      const submitBtn = document.getElementById('btn-login-submit');

      // Check URL parameters for registration redirect
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('registered') === 'true') {
        const regEmail = urlParams.get('email');
        if (regEmail && emailInput) {
          emailInput.value = decodeURIComponent(regEmail);
        }
        if (alertBox) {
          alertBox.className = 'auth-alert-message auth-alert-success active';
          alertBox.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>✦ Royal Host Account registered successfully! Please enter your password to sign in.</span>
          `;
        }
        if (passwordInput) {
          passwordInput.focus();
        }
      }

      // Role Tabs
      roleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          roleTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          activeRole = tab.getAttribute('data-role');
          if (alertBox) alertBox.classList.remove('active');
        });
      });

      // Password Toggle
      document.querySelectorAll('.password-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const input = btn.previousElementSibling;
          if (input && input.tagName === 'INPUT') {
            const isText = input.type === 'text';
            input.type = isText ? 'password' : 'text';
            btn.innerHTML = isText 
              ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="7" r="3"></circle></svg>'
              : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
          }
        });
      });

      // Form Submit (Enter email & password -> Login -> Navigate to Dashboard)
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput?.value.trim();
        const password = passwordInput?.value.trim();

        if (!email) {
          showFieldTooltip(emailInput, 'Please enter your account email');
          return;
        }
        if (!isValidEmail(email)) {
          showFieldTooltip(emailInput, 'Please enter a valid email address (e.g. name@domain.com)');
          return;
        }
        removeFieldTooltip(emailInput);

        if (!password) {
          showFieldTooltip(passwordInput, 'Please enter your password');
          return;
        }
        removeFieldTooltip(passwordInput);

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Verifying &amp; Logging In...</span>';
        }

        setTimeout(() => {
          const res = authenticateUser(email, password, activeRole);
          if (res.success) {
            if (alertBox) {
              alertBox.className = 'auth-alert-message auth-alert-success active';
              alertBox.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>Access Granted for <strong>${res.user.name}</strong>. Opening ${res.user.role === 'admin' ? 'Admin Console' : 'Celebration Portal'}...</span>
              `;
            }
            setTimeout(() => {
              navigateToDashboard(res.user.role);
            }, 350);
          } else {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = `
                <span>Access Celebration Portal</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              `;
            }
            if (alertBox) {
              alertBox.className = 'auth-alert-message auth-alert-error active';
              alertBox.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span>${res.message}</span>
              `;
            }
          }
        }, 200);
      });
    }

    // 2. REGISTER PAGE LOGIC (Registration -> Redirect to login.html)
    const regForm = document.getElementById('stackly-register-form');
    if (regForm) {
      const nameInput = document.getElementById('reg-name');
      const emailInput = document.getElementById('reg-email');
      const phoneInput = document.getElementById('reg-phone');
      const passInput = document.getElementById('reg-password');
      const confirmInput = document.getElementById('reg-confirm-password');
      const interestSelect = document.getElementById('reg-interest');
      const alertBox = document.getElementById('reg-alert-box');
      const submitBtn = document.getElementById('btn-reg-submit');

      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = nameInput?.value.trim();
        const email = emailInput?.value.trim();
        const phone = phoneInput?.value.trim();
        const pass = passInput?.value.trim();
        const confirm = confirmInput?.value.trim();
        const interest = interestSelect?.value || 'wedding';

        if (!name) {
          showFieldTooltip(nameInput, 'Please fill in this field');
          return;
        }
        removeFieldTooltip(nameInput);

        // ERP-005: Validate email presence AND format
        if (!email) {
          showFieldTooltip(emailInput, 'Please fill in this field');
          return;
        }
        if (!isValidEmail(email)) {
          showFieldTooltip(emailInput, 'Please enter a valid email address (e.g. name@domain.com)');
          return;
        }
        removeFieldTooltip(emailInput);

        if (!pass) {
          showFieldTooltip(passInput, 'Please fill in this field');
          return;
        }
        removeFieldTooltip(passInput);

        if (pass.length < 6) {
          showFieldTooltip(passInput, 'Password must be at least 6 characters');
          return;
        }
        removeFieldTooltip(passInput);

        if (pass !== confirm) {
          showFieldTooltip(confirmInput, 'Passwords do not match');
          return;
        }
        removeFieldTooltip(confirmInput);

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Registering Royal Account...</span>';
        }

        setTimeout(() => {
          const res = registerUser({
            name,
            email,
            phone,
            password: pass,
            interest
          });

          if (res.success) {
            if (alertBox) {
              alertBox.className = 'auth-alert-message auth-alert-success active';
              alertBox.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>✦ Registration Successful! Redirecting to Sign In...</span>
              `;
            }
            // Navigate to login page as explicitly requested
            setTimeout(() => {
              window.location.href = `login.html?registered=true&email=${encodeURIComponent(email)}`;
            }, 600);
          } else {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = '<span>Complete Royal Registration</span>';
            }
            if (alertBox) {
              alertBox.className = 'auth-alert-message auth-alert-error active';
              alertBox.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span>${res.message}</span>
              `;
            }
          }
        }, 200);
      });
    }

    // 3. GLOBAL LOGOUT TRIGGER (Always redirects to home page: index.html)
    document.querySelectorAll('.btn-dash-logout, #global-logout-btn, #sidebar-logout-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    });
  });

  // Expose global auth utilities
  window.StacklyAuth = {
    getCurrentUser,
    setCurrentUser,
    clearCurrentUser,
    authenticateUser,
    registerUser,
    navigateToDashboard,
    logout,
    syncNavbarState,
    formatUsernameFromEmail
  };
})();
