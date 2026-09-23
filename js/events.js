/**
 * Stackly Theme - Luxury Celebration Events & Booking Controller
 * Weddings, Birthdays, Dancing/DJ Sangeet, Baby Naming & Milestone Celebrations
 */

(function () {
  'use strict';

  const CELEBRATION_EVENTS = [
    {
      id: 'evt-wed-01',
      title: 'The Royal Grand Palace Wedding & Reception',
      category: 'wedding',
      categoryLabel: 'Royal Wedding',
      date: 'Nov 18, 2026',
      time: '6:30 PM - 11:30 PM',
      location: 'Taj Vivanta Palace, Salem',
      description: 'An enchanting royal wedding celebration with grand floral mandap, royal shehnai, live symphony, and grand 7-course gourmet feast.',
      price: 250,
      seatsLeft: 35,
      imageUrl: 'assets/img-1519741497674-611481863552.webp'
    },
    {
      id: 'evt-bday-02',
      title: 'Neon Carnival: Grand 18th Birthday Bash',
      category: 'birthday',
      categoryLabel: 'Birthday Gala',
      date: 'Nov 26, 2026',
      time: '7:00 PM - Midnight',
      location: 'Skyline Terrace Club, Salem',
      description: 'High-energy birthday extravaganza featuring celebrity DJ beats, 3D laser visual shows, signature mocktail bars, and confetti showers.',
      price: 120,
      seatsLeft: 50,
      imageUrl: 'assets/img-1464349095431-e9a21285b5f3.webp'
    },
    {
      id: 'evt-dance-03',
      title: 'Bollywood Beats & Sangeet Dance Night',
      category: 'dance',
      categoryLabel: 'Dancing & Sangeet',
      date: 'Dec 05, 2026',
      time: '8:00 PM - 1:00 AM',
      location: 'Grand Ballroom, Stackly Arena',
      description: 'Electrifying couple & solo dance performances, high-bass dhol players, live LED dance floor, and nonstop dancing excitement.',
      price: 150,
      seatsLeft: 40,
      imageUrl: 'assets/img-1516450360452-9312f5e86fc7.webp'
    },
    {
      id: 'evt-baby-04',
      title: 'Traditional Baby Naming Ceremony (Namakaran)',
      category: 'baby-naming',
      categoryLabel: 'Baby Naming',
      date: 'Dec 14, 2026',
      time: '9:30 AM - 2:00 PM',
      location: 'Heritage Orchid Gardens, Salem',
      description: 'A serene and blissful cradle ceremony welcoming baby into the family, with traditional floral cradle decor, Vedic chanting, and festive lunch.',
      price: 95,
      seatsLeft: 60,
      imageUrl: 'assets/img-1519689680058-324335c77eba.webp'
    },
    {
      id: 'evt-wed-05',
      title: 'Sunset Beachfront Wedding & Cocktail Soiree',
      category: 'wedding',
      categoryLabel: 'Destination Wedding',
      date: 'Jan 08, 2027',
      time: '4:30 PM - 10:30 PM',
      location: 'Golden Sands Resort & Bay',
      description: 'Intimate beach wedding with golden hour vows, fairy-lit palm arches, live saxophone melodies, and champagne toast under the stars.',
      price: 320,
      seatsLeft: 20,
      imageUrl: 'assets/img-1511285560929-80b456fea0bc.webp'
    },
    {
      id: 'evt-bday-06',
      title: 'Fairytale 1st Birthday & Cradle Wonder',
      category: 'birthday',
      categoryLabel: 'Kids Birthday',
      date: 'Jan 22, 2027',
      time: '4:00 PM - 8:30 PM',
      location: 'Lotus Grand Pavilion, Salem',
      description: 'A magical celebration of baby\'s first milestone featuring hot air balloon decor, interactive puppet theater, candy wonderland, and photo studio.',
      price: 110,
      seatsLeft: 45,
      imageUrl: 'assets/img-1530103862676-de8c9debad1d.webp'
    }
  ];

  document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('events-grid-container');
    const filterPills = document.querySelectorAll('.filter-pill');
    const modal = document.getElementById('registration-modal');
    const modalClose = document.getElementById('modal-close-btn');
    const regForm = document.getElementById('registration-form');
    const modalEventTitle = document.getElementById('modal-event-name');
    const ticketSelect = document.getElementById('ticket-tier');
    const quantityInput = document.getElementById('ticket-quantity');
    const totalPriceDisplay = document.getElementById('total-price-display');
    const regSuccess = document.getElementById('modal-reg-success');

    let currentEvent = CELEBRATION_EVENTS[0];

    function renderEvents(events) {
      if (!grid) return;
      if (events.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--color-text-secondary);">
            <h3 style="font-size: 24px; color: #ffffff; margin-bottom: 8px;">No celebrations found</h3>
            <p>Try searching for a different keyword or celebration category.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = events.map(evt => `
        <div class="event-card" data-category="${evt.category}">
          <div class="event-card-header">
            <img src="${evt.imageUrl}" alt="${evt.title}" loading="lazy">
            <span class="event-category-badge">${evt.categoryLabel}</span>
            <span class="event-seats-tag">${evt.seatsLeft} passes left</span>
          </div>
          <div class="event-card-body">
            <div class="event-date-row">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="18" y2="10"></line></svg>
              <span>${evt.date} • ${evt.location}</span>
            </div>
            <h3 class="event-card-title">${evt.title}</h3>
            <p class="event-card-desc">${evt.description}</p>
            <div class="event-card-footer">
              <div class="event-price">₹${evt.price} <span>/ guest pass</span></div>
              <button class="btn btn-primary btn-card-register" data-event-id="${evt.id}">Book Pass</button>
            </div>
          </div>
        </div>
      `).join('');

      grid.querySelectorAll('.btn-card-register').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-event-id');
          const found = CELEBRATION_EVENTS.find(e => e.id === id);
          if (found) openRegistrationModal(found);
        });
      });
    }

    function openRegistrationModal(evt) {
      currentEvent = evt;
      if (modalEventTitle) modalEventTitle.textContent = evt.title;
      updateTotal();
      if (regSuccess) regSuccess.style.display = 'none';
      if (regForm) regForm.style.display = 'block';
      modal?.classList.add('active');
    }

    function closeModal() {
      modal?.classList.remove('active');
    }

    function updateTotal() {
      if (!ticketSelect || !quantityInput || !totalPriceDisplay) return;
      const basePrice = currentEvent ? currentEvent.price : 150;
      const multiplier = parseFloat(ticketSelect.value) || 1;
      const qty = parseInt(quantityInput.value, 10) || 1;
      const total = Math.round(basePrice * multiplier * qty);
      totalPriceDisplay.textContent = `₹${total}`;
    }

    ticketSelect?.addEventListener('change', updateTotal);
    quantityInput?.addEventListener('input', updateTotal);
    modalClose?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    regForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const bookingRef = 'ROYAL-' + Math.floor(100000 + Math.random() * 900000);
      if (regForm) regForm.style.display = 'none';
      if (regSuccess) {
        regSuccess.innerHTML = `
          <div style="text-align: center; padding: 25px 0;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(212, 175, 55, 0.2); border: 2px solid #d4af37; color: #f6e27a; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 16px;">✦</div>
            <h4 style="font-size: 22px; color: #ffffff; margin-bottom: 8px;">Celebration Pass Confirmed!</h4>
            <p style="color: var(--color-text-secondary); font-size: 14px; margin-bottom: 16px;">Your royal invitation pass for <strong>${currentEvent.title}</strong> is reserved.</p>
            <div style="background: rgba(10, 10, 12, 0.9); border: 1px solid var(--color-border-gold); padding: 12px; border-radius: 8px; font-family: monospace; color: #f6e27a; font-size: 16px; margin-bottom: 24px;">Pass Reference: ${bookingRef}</div>
            <button class="btn btn-primary" id="success-close-btn" style="width: 100%;">Close Confirmation</button>
          </div>
        `;
        regSuccess.style.display = 'block';
        document.getElementById('success-close-btn')?.addEventListener('click', closeModal);
      }
    });

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filter = pill.getAttribute('data-filter');
        if (filter === 'all') {
          renderEvents(CELEBRATION_EVENTS);
        } else {
          const filtered = CELEBRATION_EVENTS.filter(e => e.category === filter);
          renderEvents(filtered);
        }
      });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    const filterQuery = urlParams.get('filter');

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const filtered = CELEBRATION_EVENTS.filter(e => 
        e.title.toLowerCase().includes(q) || 
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
      );
      renderEvents(filtered);
    } else if (filterQuery) {
      const activePill = document.querySelector(`.filter-pill[data-filter="${filterQuery}"]`);
      if (activePill) {
        filterPills.forEach(p => p.classList.remove('active'));
        activePill.classList.add('active');
      }
      const filtered = CELEBRATION_EVENTS.filter(e => e.category === filterQuery);
      renderEvents(filtered);
    } else {
      renderEvents(CELEBRATION_EVENTS);
    }

    // Interactive Celebration Cost Estimator on Home Page
    const estType = document.getElementById('est-event-type');
    const estGuests = document.getElementById('est-guest-count');
    const estDecor = document.getElementById('est-decor-tier');
    const estTotalDisplay = document.getElementById('est-total-amount');

    function calculateEstimate() {
      if (!estType || !estGuests || !estDecor || !estTotalDisplay) return;
      const basePerGuest = parseInt(estType.value, 10) || 50;
      const guests = parseInt(estGuests.value, 10) || 100;
      const decorTier = parseInt(estDecor.value, 10) || 1500;
      const total = (basePerGuest * guests) + decorTier;
      estTotalDisplay.textContent = `₹${total.toLocaleString()}`;
    }

    estType?.addEventListener('change', calculateEstimate);
    estGuests?.addEventListener('input', calculateEstimate);
    estDecor?.addEventListener('change', calculateEstimate);
    calculateEstimate();
  });
})();
