/**
 * Stackly Theme - Luxury Role-Based Dashboard Controller
 * Powers User / Client Celebration Portal & Admin / Operations Console
 * Supports dynamic tab switching, responsive sidebar drawer, hash deep-linking,
 * live bookings search, QR pass modal, perks redemption, and audit export.
 */

(function () {
  'use strict';

  // Sample Registered Celebration Bookings for Admin & User Views
  const SAMPLE_BOOKINGS = [
    {
      id: 'STK-WED-901',
      guestName: 'Ananya Sharma',
      guestEmail: 'client@stackly.com',
      celebration: 'The Royal Grand Palace Wedding & Reception',
      category: 'wedding',
      categoryLabel: 'Royal Wedding',
      venue: 'Taj Vivanta Palace, Salem',
      date: 'Nov 18, 2026',
      time: '6:30 PM - 11:30 PM',
      tier: 'VIP Gold Suite',
      guestsCount: 4,
      amount: '₹1,000',
      status: 'Confirmed',
      qrCodeId: 'QR-STK-901-PALACE',
      imageUrl: 'assets/img-1519741497674-611481863552.webp'
    },
    {
      id: 'STK-DANCE-408',
      guestName: 'Ananya Sharma',
      guestEmail: 'client@stackly.com',
      celebration: 'Bollywood Beats & Sangeet Dance Night',
      category: 'dance',
      categoryLabel: 'Dancing & Sangeet',
      venue: 'Grand Ballroom, Stackly Arena',
      date: 'Dec 05, 2026',
      time: '8:00 PM - 1:00 AM',
      tier: 'Couple Dance Pass',
      guestsCount: 2,
      amount: '₹300',
      status: 'Confirmed',
      qrCodeId: 'QR-STK-408-SANGEET',
      imageUrl: 'assets/img-1516450360452-9312f5e86fc7.webp'
    },
    {
      id: 'STK-BDAY-302',
      guestName: 'Rohan Mehra',
      guestEmail: 'rohan.m@gmail.com',
      celebration: 'Neon Carnival: Grand 18th Birthday Bash',
      category: 'birthday',
      categoryLabel: 'Birthday Gala',
      venue: 'Skyline Terrace Club, Salem',
      date: 'Nov 26, 2026',
      time: '7:00 PM - Midnight',
      tier: 'VIP Lounge Pass',
      guestsCount: 6,
      amount: '₹720',
      status: 'Checked-In',
      qrCodeId: 'QR-STK-302-CARNIVAL',
      imageUrl: 'assets/img-1464349095431-e9a21285b5f3.webp'
    },
    {
      id: 'STK-BABY-215',
      guestName: 'Karthik & Deepa',
      guestEmail: 'karthik.d@outlook.com',
      celebration: 'Traditional Baby Naming Ceremony (Namakaran)',
      category: 'baby-naming',
      categoryLabel: 'Baby Naming',
      venue: 'Heritage Orchid Gardens, Salem',
      date: 'Dec 14, 2026',
      time: '9:30 AM - 2:00 PM',
      tier: 'Sacred Family Pass',
      guestsCount: 12,
      amount: '₹1,140',
      status: 'Confirmed',
      qrCodeId: 'QR-STK-215-NAMAKARAN',
      imageUrl: 'assets/img-1519689680058-324335c77eba.webp'
    },
    {
      id: 'STK-WED-905',
      guestName: 'Siddharth Varma',
      guestEmail: 'sid.varma@luxuryevents.in',
      celebration: 'Sunset Beachfront Wedding & Cocktail Soiree',
      category: 'wedding',
      categoryLabel: 'Destination Wedding',
      venue: 'Golden Sands Resort & Bay',
      date: 'Jan 08, 2027',
      time: '4:30 PM - 10:30 PM',
      tier: 'Regal Beachfront Pass',
      guestsCount: 8,
      amount: '₹2,560',
      status: 'Pending Verification',
      qrCodeId: 'QR-STK-905-SUNSET',
      imageUrl: 'assets/img-1511285560929-80b456fea0bc.webp'
    },
    {
      id: 'STK-BDAY-612',
      guestName: 'Meenakshi Sundaram',
      guestEmail: 'meenakshi@gmail.com',
      celebration: 'Fairytale 1st Birthday & Cradle Wonder',
      category: 'birthday',
      categoryLabel: 'Kids Birthday',
      venue: 'Lotus Grand Pavilion, Salem',
      date: 'Jan 22, 2027',
      time: '4:00 PM - 8:30 PM',
      tier: 'Family Fairytale Suite',
      guestsCount: 15,
      amount: '₹1,650',
      status: 'Confirmed',
      qrCodeId: 'QR-STK-612-FAIRYTALE',
      imageUrl: 'assets/img-1530103862676-de8c9debad1d.webp'
    }
  ];

  // Tab Title Mappings for Top Bar Header Crumb
  const USER_TAB_TITLES = {
    'overview': 'Client Overview',
    'passes': 'My Passes & QR Tickets',
    'schedule': 'Milestone Schedule & Itinerary',
    'concierge': 'VIP Concierge Desk',
    'rewards': 'Credits & Rewards',
    'profile': 'Host Profile & Preferences'
  };

  const ADMIN_TAB_TITLES = {
    'admin-overview': 'Master Overview',
    'admin-roster': 'Live Guest Roster',
    'admin-venues': 'Salem Venues Tracker',
    'admin-tiers': 'Tier Quota Allocation',
    'admin-concierge': 'Host Inquiries Queue',
    'admin-reports': 'Financial Audit Reports'
  };

  document.addEventListener('DOMContentLoaded', () => {
    const isUserDashboard = document.body.classList.contains('page-dashboard-user');
    const isAdminDashboard = document.body.classList.contains('page-dashboard-admin');

    // 1. Session & Role Initialization
    let currentUser = window.StacklyAuth ? window.StacklyAuth.getCurrentUser() : null;
    if (!currentUser) {
      if (isAdminDashboard) {
        currentUser = {
          name: 'Vikramaditya Roy',
          email: 'admin@stackly.com',
          role: 'admin',
          tier: 'Chief Event Marshal',
          avatarInitial: 'V'
        };
      } else {
        currentUser = {
          name: 'Ananya Sharma',
          email: 'client@stackly.com',
          role: 'user',
          tier: 'VIP Gold Host',
          avatarInitial: 'A'
        };
      }
      if (window.StacklyAuth) {
        window.StacklyAuth.setCurrentUser(currentUser);
      }
    }

    // Update dynamic profile text across top bar and sidebar
    function syncUserHeaderInfo() {
      const nameDisplays = document.querySelectorAll('.user-name-display');
      const emailDisplays = document.querySelectorAll('.user-email-display');
      const avatarDisplays = document.querySelectorAll('.user-avatar-display');

      nameDisplays.forEach(el => el.textContent = currentUser.name);
      emailDisplays.forEach(el => el.textContent = currentUser.email);
      avatarDisplays.forEach(el => el.textContent = currentUser.avatarInitial || currentUser.name.charAt(0).toUpperCase());

      // Pre-fill profile form fields if present
      const profNameInput = document.getElementById('prof-name');
      const profEmailInput = document.getElementById('prof-email');
      if (profNameInput && currentUser.name) profNameInput.value = currentUser.name;
      if (profEmailInput && currentUser.email) profEmailInput.value = currentUser.email;
    }
    syncUserHeaderInfo();

    // 2. Mobile Sidebar Toggle & Drawer Overlay
    const sidebar = document.getElementById('dash-sidebar');
    const sidebarOverlay = document.getElementById('dash-sidebar-overlay');
    const sidebarToggleBtn = document.getElementById('dash-sidebar-toggle');
    const sidebarCloseBtn = document.getElementById('dash-sidebar-close');

    function openSidebar() {
      if (sidebar) sidebar.classList.add('open');
      if (sidebarOverlay) sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      if (sidebar) sidebar.classList.remove('open');
      if (sidebarOverlay) sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    sidebarToggleBtn?.addEventListener('click', openSidebar);
    sidebarCloseBtn?.addEventListener('click', closeSidebar);
    sidebarOverlay?.addEventListener('click', closeSidebar);

    // 3. Dynamic Sidebar Tab Switching Controller
    const navButtons = document.querySelectorAll('.dash-sidebar-btn');
    const tabPanes = document.querySelectorAll('.dash-tab-pane');
    const activeTitle = document.getElementById('dash-active-title');
    const titleMap = isUserDashboard ? USER_TAB_TITLES : ADMIN_TAB_TITLES;

    function activateTab(tabKey, updateHash = true) {
      if (!tabKey) return;
      const targetPane = document.getElementById(`tab-${tabKey}`);
      if (!targetPane) return;

      // Update sidebar nav buttons
      navButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update tab pane visibility
      tabPanes.forEach(pane => {
        if (pane.id === `tab-${tabKey}`) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });

      // Update top bar breadcrumb
      if (activeTitle && titleMap[tabKey]) {
        activeTitle.textContent = titleMap[tabKey];
      }

      // Sync URL hash
      if (updateHash && window.location.hash !== `#${tabKey}`) {
        history.replaceState(null, '', `#${tabKey}`);
      }

      // Close mobile drawer on tab selection
      closeSidebar();

      // Scroll content container to top
      const contentContainer = document.querySelector('.dash-content-container');
      if (contentContainer) {
        contentContainer.scrollTop = 0;
      }
    }

    // Bind sidebar buttons
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabKey = btn.getAttribute('data-tab');
        activateTab(tabKey);
      });
    });

    // Bind in-page action tab triggers (e.g. "View Timeline", "Download Passes", etc.)
    document.querySelectorAll('.btn-tab-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const targetTab = trigger.getAttribute('data-target');
        if (targetTab) {
          activateTab(targetTab);
        }
      });
    });

    // Check URL Hash on Initial Page Load
    function handleInitialHash() {
      const hash = window.location.hash.replace('#', '');
      if (hash && document.getElementById(`tab-${hash}`)) {
        activateTab(hash, false);
      }
    }
    handleInitialHash();
    window.addEventListener('hashchange', handleInitialHash);

    // 4. Logout Handling
    const logoutButtons = document.querySelectorAll('.btn-dash-logout');
    logoutButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you wish to sign out of Stackly?')) {
          if (window.StacklyAuth && typeof window.StacklyAuth.logout === 'function') {
            window.StacklyAuth.logout();
          } else {
            localStorage.removeItem('stackly_auth_user');
            sessionStorage.removeItem('stackly_auth_user');
            window.location.href = 'index.html';
          }
        }
      });
    });

    // ========================================================================
    // 5. USER / CLIENT DASHBOARD SPECIFIC INTERACTION
    // ========================================================================
    if (isUserDashboard) {
      // (A) QR Pass Modal Functionality
      const qrModal = document.getElementById('qr-ticket-modal');
      const qrCloseBtn = document.getElementById('qr-close-btn');
      const qrModalTitle = document.getElementById('qr-modal-title');
      const qrModalSub = document.getElementById('qr-modal-sub');
      const qrModalId = document.getElementById('qr-modal-id');
      const qrModalVenue = document.getElementById('qr-modal-venue');
      const qrModalDate = document.getElementById('qr-modal-date');
      const qrModalGuests = document.getElementById('qr-modal-guests');
      const downloadBtn = document.getElementById('btn-download-pass');

      document.querySelectorAll('.btn-view-qr').forEach(btn => {
        btn.addEventListener('click', () => {
          const passId = btn.getAttribute('data-pass-id');
          const found = SAMPLE_BOOKINGS.find(b => b.id === passId) || SAMPLE_BOOKINGS[0];

          if (qrModalTitle) qrModalTitle.textContent = found.celebration;
          if (qrModalSub) qrModalSub.textContent = `${found.tier} • ${found.categoryLabel}`;
          if (qrModalId) qrModalId.textContent = found.id;
          if (qrModalVenue) qrModalVenue.textContent = found.venue;
          if (qrModalDate) qrModalDate.textContent = `${found.date} (${found.time})`;
          if (qrModalGuests) qrModalGuests.textContent = `${found.guestsCount} Confirmed Guests`;

          qrModal?.classList.add('active');
        });
      });

      qrCloseBtn?.addEventListener('click', () => qrModal?.classList.remove('active'));
      qrModal?.addEventListener('click', (e) => {
        if (e.target === qrModal) qrModal.classList.remove('active');
      });

      downloadBtn?.addEventListener('click', () => {
        downloadBtn.innerHTML = '<span>Generating Luxury Pass PDF...</span>';
        setTimeout(() => {
          alert('✦ Digital VIP Gate Pass saved to your device. Please present this QR ticket at the gate in Salem.');
          downloadBtn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Download PDF Pass</span>
          `;
          qrModal?.classList.remove('active');
        }, 600);
      });

      // (B) Rewards & Credits Perk Redemption
      let currentCredits = 350;
      const creditDisplay = document.querySelector('#tab-rewards [style*="font-size: 42px"]');
      const sidebarRewardBadge = document.querySelector('#dash-user-nav [data-tab="rewards"] .dash-sidebar-badge');

      document.querySelectorAll('.btn-redeem-perk').forEach(button => {
        button.addEventListener('click', () => {
          const perkName = button.getAttribute('data-perk') || 'Luxury Add-on';
          const cost = parseInt(button.getAttribute('data-cost') || '100', 10);

          if (button.classList.contains('redeemed')) {
            alert(`✦ You have already redeemed "${perkName}". Our team has registered this upgrade.`);
            return;
          }

          if (currentCredits < cost) {
            alert(`✦ Insufficient credit balance to redeem "${perkName}". You currently have ₹${currentCredits} credits.`);
            return;
          }

          const confirmRedeem = confirm(`Redeem "${perkName}" using ₹${cost} of your celebration reward credits?`);
          if (confirmRedeem) {
            currentCredits -= cost;
            if (creditDisplay) {
              creditDisplay.innerHTML = `₹${currentCredits}<span style="font-size: 20px; font-weight: 600; color: var(--color-text-secondary);">.00</span>`;
            }
            if (sidebarRewardBadge) {
              sidebarRewardBadge.textContent = `₹${currentCredits}`;
            }

            button.classList.add('redeemed');
            button.textContent = '✓ Perk Redeemed';
            button.style.background = 'rgba(76, 217, 100, 0.2)';
            button.style.color = '#4cd964';
            button.style.borderColor = 'rgba(76, 217, 100, 0.4)';

            alert(`✦ Luxury Perk Confirmed!\n"${perkName}" has been officially added to your celebration itinerary. Remaining balance: ₹${currentCredits}.`);
          }
        });
      });

      // (C) Concierge Special Request Form Dispatch
      const conciergeForm = document.getElementById('concierge-request-form');
      const conciergeLogList = document.getElementById('concierge-log-list');

      conciergeForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const celebrationSelect = document.getElementById('req-celebration');
        const deptSelect = document.getElementById('req-category');
        const messageInput = document.getElementById('concierge-message');

        const celebration = celebrationSelect?.value || 'The Royal Grand Palace Wedding';
        const dept = deptSelect?.value || 'Special Request';
        const message = messageInput?.value.trim();

        if (message) {
          // Prepend new entry into activity log
          if (conciergeLogList) {
            const newLog = document.createElement('div');
            newLog.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(10, 10, 14, 0.6); border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.25); animation: dashTabFade 0.3s ease;';
            newLog.innerHTML = `
              <div>
                <strong style="color: #ffffff; font-size: 13.5px;">${escapeHtml(message.slice(0, 50))}${message.length > 50 ? '...' : ''}</strong>
                <div style="font-size: 12px; color: var(--color-text-secondary);">${celebration.split('(')[0]} &bull; Just now &bull; ${dept.split('(')[0]}</div>
              </div>
              <span class="pass-status-pill" style="background: rgba(255, 149, 0, 0.2); color: #ff9500;">✓ Dispatched to Marshal</span>
            `;
            conciergeLogList.prepend(newLog);
          }

          alert(`✦ VIP Concierge Request Received!\n"${message}"\n\nSalem Lead Coordinator assigned. We will reach you at your contact number within 15 minutes.`);
          if (messageInput) messageInput.value = '';
        }
      });

      // (D) Host Profile Save Preferences
      const hostProfileForm = document.getElementById('host-profile-form');
      hostProfileForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameVal = document.getElementById('prof-name')?.value.trim();
        const emailVal = document.getElementById('prof-email')?.value.trim();
        const phoneVal = document.getElementById('prof-phone')?.value.trim();
        const cityVal = document.getElementById('prof-city')?.value.trim();

        if (nameVal) {
          currentUser.name = nameVal;
          currentUser.avatarInitial = nameVal.charAt(0).toUpperCase();
        }
        if (emailVal) {
          currentUser.email = emailVal;
        }

        if (window.StacklyAuth) {
          window.StacklyAuth.setCurrentUser(currentUser);
        } else {
          localStorage.setItem('stackly_auth_user', JSON.stringify(currentUser));
        }

        syncUserHeaderInfo();
        alert(`✦ Profile Preferences Saved!\nHost information for ${nameVal} (${cityVal || 'Salem'}) updated successfully across all upcoming event manifests.`);
      });
    }

    // ========================================================================
    // 6. ADMIN / MARSHAL DASHBOARD SPECIFIC INTERACTION
    // ========================================================================
    if (isAdminDashboard) {
      const tableBody = document.getElementById('admin-bookings-tbody');
      const searchInput = document.getElementById('admin-search-input');
      const filterSelect = document.getElementById('admin-filter-category');
      const exportRosterBtn = document.getElementById('btn-export-csv');
      const exportAuditBtn = document.getElementById('btn-export-audit');

      let currentList = [...SAMPLE_BOOKINGS];

      function renderAdminTable(bookings) {
        if (!tableBody) return;
        if (bookings.length === 0) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="7" style="text-align: center; padding: 40px; color: var(--color-text-secondary);">
                No matching celebration bookings found.
              </td>
            </tr>
          `;
          return;
        }

        tableBody.innerHTML = bookings.map(b => `
          <tr data-booking-id="${b.id}">
            <td>
              <span class="pass-id-code">${b.id}</span>
            </td>
            <td>
              <div class="table-guest-cell">
                <div class="guest-avatar-small">${b.guestName.charAt(0)}</div>
                <div>
                  <div class="guest-name-text">${b.guestName}</div>
                  <div class="guest-email-text">${b.guestEmail}</div>
                </div>
              </div>
            </td>
            <td>
              <div style="font-weight: 700; color: #ffffff;">${b.celebration}</div>
              <div style="font-size: 12px; color: var(--color-accent-gold-light);">${b.venue}</div>
            </td>
            <td>
              <div style="font-size: 13px; color: #ffffff;">${b.date}</div>
              <div style="font-size: 11.5px; color: var(--color-text-secondary);">${b.time}</div>
            </td>
            <td>
              <div style="font-weight: 800; color: var(--color-accent-gold-light);">${b.amount}</div>
              <div style="font-size: 11px; color: var(--color-text-secondary);">${b.guestsCount} Guests</div>
            </td>
            <td>
              <span class="pass-status-pill ${b.status === 'Checked-In' ? 'status-confirmed' : b.status === 'Confirmed' ? 'status-confirmed' : 'status-pending'}">
                ${b.status}
              </span>
            </td>
            <td>
              <button class="btn-table-checkin ${b.status === 'Checked-In' ? 'checked-in' : ''}" data-id="${b.id}">
                ${b.status === 'Checked-In' ? '✓ Checked In' : 'Verify & Check In'}
              </button>
            </td>
          </tr>
        `).join('');

        // Attach check-in toggle handlers
        tableBody.querySelectorAll('.btn-table-checkin').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const item = currentList.find(x => x.id === id);
            if (item && item.status !== 'Checked-In') {
              item.status = 'Checked-In';
              btn.classList.add('checked-in');
              btn.textContent = '✓ Checked In';
              const pill = btn.closest('tr')?.querySelector('.pass-status-pill');
              if (pill) {
                pill.textContent = 'Checked-In';
                pill.className = 'pass-status-pill status-confirmed';
              }
              alert(`✦ Check-In Approved for ${item.guestName} at ${item.celebration}.\nGate verification complete in Salem.`);
            } else if (item && item.status === 'Checked-In') {
              alert(`✦ Pass ${item.id} is already checked in.`);
            }
          });
        });
      }

      function applyFilters() {
        const query = (searchInput?.value || '').trim().toLowerCase();
        const cat = filterSelect?.value || 'all';

        const filtered = currentList.filter(b => {
          const matchesQuery = b.guestName.toLowerCase().includes(query) ||
                               b.id.toLowerCase().includes(query) ||
                               b.celebration.toLowerCase().includes(query) ||
                               b.venue.toLowerCase().includes(query);
          const matchesCat = cat === 'all' || b.category === cat;
          return matchesQuery && matchesCat;
        });

        renderAdminTable(filtered);
      }

      searchInput?.addEventListener('input', applyFilters);
      filterSelect?.addEventListener('change', applyFilters);
      renderAdminTable(currentList);

      // (A) Guest Roster CSV Export
      exportRosterBtn?.addEventListener('click', () => {
        let csv = 'Booking ID,Guest Name,Email,Celebration,Venue,Date,Amount,Guests,Status\n';
        currentList.forEach(b => {
          csv += `"${b.id}","${b.guestName}","${b.guestEmail}","${b.celebration}","${b.venue}","${b.date}","${b.amount}","${b.guestsCount}","${b.status}"\n`;
        });
        triggerCsvDownload(csv, `stackly-guest-roster-${Date.now()}.csv`);
      });

      // (B) Financial Audit CSV Export
      exportAuditBtn?.addEventListener('click', () => {
        let csv = 'Milestone Category,Bookings Count,Gross Sales,Platform Fee,Salem Venue Share,Status\n';
        csv += '"Royal Weddings & Receptions","772 Guests (24 Suites)","₹62,400","₹6,240","₹56,160","Disbursed"\n';
        csv += '"Grand Milestone Birthdays","478 Guests (18 Lounges)","₹34,200","₹3,420","₹30,780","Disbursed"\n';
        csv += '"Sangeet & DJ Dance Nights","368 Guests (58 Passes)","₹28,900","₹2,890","₹26,010","Disbursed"\n';
        csv += '"Baby Naming Ceremonies","222 Guests (10 Suites)","₹23,000","₹2,300","₹20,700","Pending Bank Wire"\n';
        triggerCsvDownload(csv, `stackly-financial-audit-${Date.now()}.csv`);
      });

      // (C) Concierge Approvals & Stored Inquiries in Admin View (ERP-004)
      const conciergeSection = document.getElementById('tab-admin-concierge');
      const conciergeTbody = conciergeSection?.querySelector('tbody');

      // Load and render persistent contact enquiries from website
      try {
        const storedEnquiries = localStorage.getItem('stackly_contact_enquiries');
        if (storedEnquiries && conciergeTbody) {
          const enquiries = JSON.parse(storedEnquiries);
          enquiries.forEach(enq => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td><strong>${enq.name}</strong><br><small style="color: var(--color-text-secondary);">${enq.email}${enq.phone ? ' • ' + enq.phone : ''}</small></td>
              <td>${enq.subject || 'Website Inquiry'}</td>
              <td>${enq.message || 'General bespoke milestone inquiry'}</td>
              <td><span class="pass-category-pill">Public Inquiry</span></td>
              <td><span class="pass-status-pill" style="background: rgba(255, 149, 0, 0.2); color: #ff9500;">${enq.status || 'Pending Review'}</span></td>
              <td><button type="button" class="btn btn-primary" style="min-height: 30px; padding: 2px 10px; font-size: 11px;">Approve</button></td>
            `;
            conciergeTbody.prepend(tr);
          });
        }
      } catch (err) {
        console.warn('Error rendering stored enquiries:', err);
      }

      conciergeSection?.querySelectorAll('tbody tr').forEach(row => {
        const approveBtn = row.querySelector('.btn-primary');
        const updateBtn = row.querySelector('.btn-secondary');
        const pill = row.querySelector('.pass-status-pill');

        approveBtn?.addEventListener('click', () => {
          if (pill) {
            pill.textContent = '✓ Approved by Marshal';
            pill.className = 'pass-status-pill status-confirmed';
          }
          approveBtn.textContent = 'Assigned';
          approveBtn.classList.remove('btn-primary');
          approveBtn.classList.add('btn-secondary');
          approveBtn.disabled = true;
          alert('✦ Request Approved! VIP concierge work order dispatched to Salem field crew.');
        });

        updateBtn?.addEventListener('click', () => {
          const notes = prompt('Enter status update or coordinator notes for this request:');
          if (notes) {
            alert(`✦ Status note recorded: "${notes}". Client portal updated.`);
          }
        });
      });

      // (D) Tier Quota Adjustments
      const tierSection = document.getElementById('tab-admin-tiers');
      tierSection?.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.includes('Adjust Quota')) {
          btn.addEventListener('click', () => {
            const card = btn.closest('div[style*="background: rgba(22, 22, 30"]');
            const title = card?.querySelector('h4')?.textContent || 'Tier';
            const newQuota = prompt(`Enter new capacity quota for ${title}:`, '65');
            if (newQuota && !isNaN(newQuota)) {
              alert(`✦ Capacity quota for "${title}" updated to ${newQuota} tickets across Salem venues.`);
            }
          });
        }
      });
    }

    // Helper: Trigger CSV file download
    function triggerCsvDownload(csvContent, filename) {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }

    // Helper: Simple HTML sanitization
    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  });
})();
