(() => {
  const CONFIG = {
    desktopMinWidth: 1025,
    closeDelay: 180,
    swipeCloseThreshold: 96,
    swipeIgnoreHorizontalRatio: 1.15,
  };

  const selectors = {
    // Catatan: '#sidebar-profile' sengaja TIDAK dimasukkan di sini lagi.
    // Baris profil di bawah sidebar sekarang dipakai khusus untuk
    // popover "Ganti Akun" (lihat account-switcher.js). Panel profil
    // lengkap ini tetap bisa dibuka lewat avatar di topbar.
    desktopTriggers: ['#topbar-user'],
    desktopAvatar: ['#topbar-avatar', '#sidebar-profile img'],
    desktopName: ['#topbar-user-name', '#sidebar-profile .profile-info h4'],
    desktopLevel: ['#topbar-user-level', '#sidebar-profile .profile-info span'],
  };

  let state = {
    isOpen: false,
    closeTimer: null,
    drag: null,
    elements: {},
  };

  function initProfileSheet() {
    if (document.querySelector('[data-profile-sheet-root]')) return;

    const data = getProfileData();
    const elements = renderProfileSheet(data);
    state.elements = elements;

    bindPrimaryTriggers(elements);
    bindOverlay(elements);
    bindDesktopHover(elements);
    bindSwipeToClose(elements);
    bindResponsiveReset(elements);
    bindMenuFeedback(elements);
    bindProfileSync();
  }

  /* =========================================================
     SYNC — dengarkan perubahan dari Edit Profile (Edit.js)
     Tanpa ini, panel profil cuma nampilin data snapshot dari
     saat halaman pertama kali dimuat (bug: data lama saat demo).
     ========================================================= */
  function bindProfileSync() {
    document.addEventListener('kejuu:profile-updated', handleProfileUpdated);
  }

  function handleProfileUpdated(event) {
    const { root } = state.elements;
    if (!root) return;

    const detail = event.detail || {};

    // Prioritaskan data dari event (langsung dari form Edit Profile),
    // fallback ke DOM topbar kalau field-nya tidak ada di detail.
    const displayName = detail.displayName || getText(selectors.desktopName, 'User');
    const avatar = detail.avatar || getImage(selectors.desktopAvatar, '');
    const handle = detail.username
      ? `@${detail.username}`
      : `@${slugify(displayName) || 'kejuu.user'}`;
    const email = inferEmail(displayName);

    applyProfileFields({ displayName, avatar, handle, email });
  }

  function applyProfileFields({ displayName, avatar, handle, email }) {
    const { nameEl, handleEl, emailEl, avatarImg } = state.elements;

    if (nameEl) nameEl.textContent = displayName;
    if (handleEl) handleEl.textContent = handle;
    if (emailEl) emailEl.textContent = email;
    if (avatarImg) {
      avatarImg.src = avatar;
      avatarImg.alt = displayName;
    }
  }

  function getProfileData() {
    const displayName = getText(selectors.desktopName, 'User');
    const levelText = getText(selectors.desktopLevel, 'Level 1');
    const avatar = getImage(selectors.desktopAvatar, '');
    const email = inferEmail(displayName);
    const numericLevel = extractLevel(levelText);
    const handle = `@${slugify(displayName) || 'kejuu.user'}`;

    return {
      displayName,
      levelText,
      numericLevel,
      avatar,
      email,
      handle,
      tagline: 'Belajar bahasa sambil tetap tampil rapi, aktif, dan gampang diakses dari mana aja.',
      stats: [
        { value: `${numericLevel}`, label: 'Level' },
        { value: '12.8k', label: 'XP' },
        { value: '9 hari', label: 'Streak' },
        { value: '4', label: 'Bahasa' },
      ],
      chips: [
        { icon: 'spark', label: 'Mode sosial aktif' },
        { icon: 'globe', label: 'Belajar multi bahasa' },
        { icon: 'bell', label: 'Notifikasi pintar' },
      ],
      menus: [
        [
          {
            icon: 'user',
            title: 'Profil & akun',
            subtitle: 'Nama, avatar, bio, dan info publik',
          },
          {
            icon: 'message',
            title: 'Inbox & pesan',
            subtitle: 'DM, mention, dan update penting',
          },
        ],
        [
          {
            icon: 'language',
            title: 'Bahasa & tampilan',
            subtitle: 'Atur bahasa aplikasi dan preferensi layar',
          },
          {
            icon: 'shield',
            title: 'Privasi & izin',
            subtitle: 'Kontrol visibilitas profil dan akses akun',
          },
        ],
        [
          {
            icon: 'phone',
            title: 'Perangkat terhubung',
            subtitle: 'Kelola sesi login dan device aktif',
          },
          {
            icon: 'link',
            title: 'Connector & aplikasi',
            subtitle: 'Hubungkan fitur tambahan dan integrasi',
          },
        ],
      ],
    };
  }

  function renderProfileSheet(data) {
    const root = document.createElement('div');
    root.dataset.profileSheetRoot = 'true';
    root.innerHTML = `
      <div class="profile-hotspot" aria-hidden="true"></div>
      <div class="profile-sheet-overlay" data-profile-overlay></div>
      <aside
        class="profile-sheet"
        data-profile-sheet
        aria-hidden="true"
        aria-label="Panel profil"
      >
        <div class="profile-sheet__inner">
          <div class="profile-sheet__drag" data-profile-drag aria-hidden="true"></div>
          <div class="profile-sheet__topbar">
            <span class="profile-sheet__hint">Geser ke bawah untuk menutup</span>
            <button type="button" class="profile-sheet__close" data-profile-close aria-label="Tutup panel profil">
              ${icon('close')}
            </button>
          </div>

          <section class="profile-sheet__hero">
            <div class="profile-sheet__identity">
              <div class="profile-sheet__identity-main">
                <div class="profile-sheet__avatar-wrap">
                  <img class="profile-sheet__avatar" src="${escapeAttr(data.avatar)}" alt="${escapeAttr(data.displayName)}">
                  <span class="profile-sheet__presence">ON</span>
                </div>

                <div class="profile-sheet__bio">
                  <div class="profile-sheet__row">
                    <h2 class="profile-sheet__name">${escapeHTML(data.displayName)}</h2>
                    <span class="profile-sheet__pill profile-sheet__pill--accent">Pro</span>
                    <span class="profile-sheet__pill">${escapeHTML(data.levelText)}</span>
                  </div>
                  <p class="profile-sheet__handle">${escapeHTML(data.handle)}</p>
                  <p class="profile-sheet__email">${escapeHTML(data.email)}</p>
                  <p class="profile-sheet__tagline">${escapeHTML(data.tagline)}</p>
                </div>
              </div>

              <div class="profile-sheet__actions">
                <button type="button" class="profile-sheet__btn profile-sheet__btn--primary" data-profile-action="edit">
                  ${icon('edit')}
                  Edit profil
                </button>
                <button type="button" class="profile-sheet__btn profile-sheet__btn--secondary" data-profile-action="share">
                  ${icon('share')}
                  Bagikan
                </button>
              </div>
            </div>
          </section>

          <div class="profile-sheet__body">
            <section class="profile-sheet__section">
              <div class="profile-sheet__stats">
                ${data.stats.map(stat => `
                  <div class="profile-sheet__stat">
                    <strong>${escapeHTML(stat.value)}</strong>
                    <span>${escapeHTML(stat.label)}</span>
                  </div>
                `).join('')}
              </div>
            </section>

            <section class="profile-sheet__section">
              <div class="profile-sheet__section-title">
                <h3>Status cepat</h3>
                <span>Tampilan ala sosial</span>
              </div>
              <div class="profile-sheet__chips">
                ${data.chips.map(chip => `
                  <span class="profile-sheet__chip">
                    ${icon(chip.icon)}
                    ${escapeHTML(chip.label)}
                  </span>
                `).join('')}
              </div>
            </section>

            <section class="profile-sheet__section profile-sheet__menu-group">
              ${data.menus.map(group => `
                <div class="profile-sheet__menu">
                  ${group.map(item => `
                    <button type="button" class="profile-sheet__item" data-profile-item="${escapeAttr(item.title)}">
                      <span class="profile-sheet__item-icon">${icon(item.icon)}</span>
                      <span class="profile-sheet__item-copy">
                        <strong>${escapeHTML(item.title)}</strong>
                        <span>${escapeHTML(item.subtitle)}</span>
                      </span>
                      <span class="profile-sheet__item-arrow">${icon('chevronRight')}</span>
                    </button>
                  `).join('')}
                </div>
              `).join('')}
            </section>

            <section class="profile-sheet__section">
              <div class="profile-sheet__footer">
                <p class="profile-sheet__footer-note">
                  Buka lewat avatar, hover area kanan atas di desktop, atau swipe turun untuk nutup.
                </p>
                <button type="button" class="profile-sheet__footer-ghost" data-profile-action="logout">
                  Logout
                </button>
              </div>
            </section>
          </div>
        </div>
      </aside>
    `;

    document.body.appendChild(root);

    return {
      root,
      hotspot: root.querySelector('.profile-hotspot'),
      overlay: root.querySelector('[data-profile-overlay]'),
      sheet: root.querySelector('[data-profile-sheet]'),
      close: root.querySelector('[data-profile-close]'),
      drag: root.querySelector('[data-profile-drag]'),
      // ── Referensi node dinamis, dipakai untuk live-update tanpa reload ──
      nameEl: root.querySelector('.profile-sheet__name'),
      handleEl: root.querySelector('.profile-sheet__handle'),
      emailEl: root.querySelector('.profile-sheet__email'),
      avatarImg: root.querySelector('.profile-sheet__avatar'),
      triggers: getTriggerElements(),
      actions: root.querySelectorAll('[data-profile-action]'),
      items: root.querySelectorAll('[data-profile-item]'),
      avatar: root.querySelector('.profile-sheet__avatar'),
      name: root.querySelector('.profile-sheet__name'),
      levelPill: root.querySelector('.profile-sheet__pill:last-child'),
    };
  }

  function bindPrimaryTriggers(elements) {
  elements.triggers.forEach(trigger => {
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');

    trigger.addEventListener('click', event => {
      event.preventDefault();
      toggleSheet();
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeSheet();
    }
  });

  elements.actions.forEach(button => {
    button.addEventListener('click', event => {

      /*
       * Edit Profile ditangani oleh profileEdit.js.
       * Jangan tutup sheet secara manual di sini,
       * biarkan editor membuka dirinya sendiri.
       */
      if (
        button.dataset.profileAction === 'edit'
      ) {
        return;
      }

      closeSheet();
    });
  });
}
  function bindOverlay(elements) {
    elements.overlay.addEventListener('click', closeSheet);
    elements.close.addEventListener('click', closeSheet);
  }

  function bindDesktopHover(elements) {
    if (!elements.hotspot || !elements.sheet) return;

    const openTargets = [elements.hotspot, elements.sheet, ...elements.triggers].filter(Boolean);

    openTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        if (!isDesktopHoverMode()) return;
        openSheet({ keepOverlay: false });
      });

      target.addEventListener('mouseleave', scheduleCloseIfOutside);
    });
  }

  function bindSwipeToClose(elements) {
    const touchSurface = elements.sheet;
    const scrollSurface = elements.sheet?.querySelector('.profile-sheet__inner');
    if (!touchSurface) return;

    touchSurface.addEventListener('touchstart', event => {
      if (!state.isOpen) return;

      const touch = event.touches[0];
      const sheetRect = touchSurface.getBoundingClientRect();
      const touchOffsetTop = touch.clientY - sheetRect.top;
      state.drag = {
        startX: touch.clientX,
        startY: touch.clientY,
        lastX: touch.clientX,
        lastY: touch.clientY,
        canClose:
          touchOffsetTop <= 132
          || (scrollSurface ? scrollSurface.scrollTop <= 4 : true),
        isDragging: true,
      };
    }, { passive: true });

    touchSurface.addEventListener('touchmove', event => {
      if (!state.drag?.isDragging) return;

      const touch = event.touches[0];
      state.drag.lastX = touch.clientX;
      state.drag.lastY = touch.clientY;
    }, { passive: true });

    touchSurface.addEventListener('touchend', () => {
      if (!state.drag?.isDragging) return;

      const deltaY = state.drag.lastY - state.drag.startY;
      const deltaX = Math.abs(state.drag.lastX - state.drag.startX);
      const canClose = state.drag.canClose;

      state.drag.isDragging = false;
      state.drag = null;

      if (
        canClose
        && deltaY > CONFIG.swipeCloseThreshold
        && deltaY > deltaX * CONFIG.swipeIgnoreHorizontalRatio
      ) {
        closeSheet();
      }
    }, { passive: true });
  }

  function bindResponsiveReset(elements) {
    window.addEventListener('resize', () => {
      clearTimeout(state.closeTimer);
      if (!state.isOpen) return;

      if (window.innerWidth >= CONFIG.desktopMinWidth) {
        elements.overlay.classList.remove('is-open');
        document.body.classList.remove('profile-sheet-open');
      } else {
        elements.overlay.classList.add('is-open');
        document.body.classList.add('profile-sheet-open');
      }
    });
  }

  function bindMenuFeedback(elements) {
    elements.items.forEach(item => {
      item.addEventListener('click', () => {
        closeSheet();
      });
    });
  }

  function openSheet(options = {}) {
    const { keepOverlay = !isDesktopHoverMode() } = options;
    const { sheet, overlay, triggers } = state.elements;
    if (!sheet) return;

    clearTimeout(state.closeTimer);
    state.isOpen = true;
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    overlay.classList.toggle('is-open', keepOverlay);
    document.body.classList.toggle('profile-sheet-open', keepOverlay);

    triggers.forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'true');
    });
  }

  function closeSheet() {
    const { sheet, overlay, triggers } = state.elements;
    if (!sheet) return;

    clearTimeout(state.closeTimer);
    state.isOpen = false;
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-open');
    document.body.classList.remove('profile-sheet-open');

    triggers.forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'false');
    });
  }

  function toggleSheet() {
    if (state.isOpen) {
      closeSheet();
      return;
    }

    openSheet();
  }

  function scheduleCloseIfOutside() {
    clearTimeout(state.closeTimer);
    state.closeTimer = window.setTimeout(() => {
      if (!isDesktopHoverMode()) return;

      const hoveringHotspot = state.elements.hotspot?.matches(':hover');
      const hoveringSheet = state.elements.sheet?.matches(':hover');
      const hoveringTrigger = state.elements.triggers.some(trigger => trigger.matches(':hover'));

      if (!hoveringHotspot && !hoveringSheet && !hoveringTrigger) {
        closeSheet();
      }
    }, CONFIG.closeDelay);
  }

  function isDesktopHoverMode() {
    return window.innerWidth >= CONFIG.desktopMinWidth
      && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

  function getTriggerElements() {
    return selectors.desktopTriggers
      .map(selector => document.querySelector(selector))
      .filter(Boolean);
  }

  function getText(selectorList, fallback) {
    for (const selector of selectorList) {
      const el = document.querySelector(selector);
      const value = el?.textContent?.trim();
      if (value) return value;
    }

    return fallback;
  }

  function getImage(selectorList, fallback) {
    for (const selector of selectorList) {
      const el = document.querySelector(selector);
      const value = el?.getAttribute('src');
      if (value) return value;
    }

    return fallback;
  }

  function extractLevel(levelText) {
    const match = String(levelText).match(/\d+/);
    return match ? match[0] : '1';
  }

  function inferEmail(displayName) {
    const slug = slugify(displayName).replace(/\./g, '');
    return `${slug || 'kejuu.user'}@kejuu.web.id`;
  }

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '.')
      .replace(/^\.+|\.+$/g, '');
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function escapeAttr(value) {
    return escapeHTML(value || '');
  }

  function icon(name) {
    const icons = {
      close: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      `,
      edit: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>
        </svg>
      `,
      share: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <path d="M8.6 13.5 15.4 17.5M15.4 6.5 8.6 10.5"/>
        </svg>
      `,
      spark: `
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="m12 2 2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2Z"/>
        </svg>
      `,
      globe: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/>
        </svg>
      `,
      bell: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5"/>
          <path d="M9 17a3 3 0 0 0 6 0"/>
        </svg>
      `,
      user: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 21a8 8 0 0 0-16 0"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      `,
      message: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      `,
      language: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m5 8 6 6"/>
          <path d="m4 14 6-6 2-3"/>
          <path d="M2 5h12"/>
          <path d="M7 2h1"/>
          <path d="m22 22-5-10-5 10"/>
          <path d="M14 18h6"/>
        </svg>
      `,
      shield: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      `,
      phone: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="7" y="2" width="10" height="20" rx="2" ry="2"/>
          <path d="M11 18h2"/>
        </svg>
      `,
      link: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7.54.54l2.92-2.92a5 5 0 0 0-7.07-7.07L11.7 5.23"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54L3.54 13.4a5 5 0 0 0 7.07 7.07l1.69-1.69"/>
        </svg>
      `,
      chevronRight: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      `,
    };

    return icons[name] || '';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileSheet, { once: true });
  } else {
    initProfileSheet();
  }

  window.ProfileSheet = {
    init: initProfileSheet,
    open: openSheet,
    close: closeSheet,
    toggle: toggleSheet,
  };
})();