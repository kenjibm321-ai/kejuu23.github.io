/* =================================================================
   DASHBOARD.JS — Main Dashboard Logic
   Uses: utils.js, state.js, api.js, data.js
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});

async function initDashboard() {
  /* ── Load data (mock for now, swap to API later) ── */
  AppState.set('user', DASHBOARD_DATA.user);
  AppState.set('overview', DASHBOARD_DATA.overview);
  AppState.set('languages', DASHBOARD_DATA.languages);
  AppState.set('recentActivity', DASHBOARD_DATA.recent_activity);
  AppState.set('insights', DASHBOARD_DATA.insights);
  AppState.set('notifications', DASHBOARD_DATA.notifications);

  /* ── Render all sections ── */
  renderSidebar();
  renderTopbar();
  renderHeroBanner();
  renderStats();
  renderLanguageProgress();
  renderRecentActivity();
  renderQuickActions();
  renderInsights();
  renderSparklines();

  /* ── Event listeners ── */
  setupEventListeners();

  /* ── Animate progress circles ── */
  setTimeout(animateProgressCircles, 300);
}

/* ========================== SIDEBAR ========================== */
function renderSidebar() {
  const nav = $id('sidebar-nav');
  if (!nav) return;

  nav.innerHTML = DASHBOARD_DATA.sidebar_nav.map(item => {
    const icon = ICONS[item.icon] || ICONS.home;
    const activeClass = item.active ? 'active' : '';
    /* Item dengan `url` (mis. Japanese/German/English/Korean) link langsung
       ke halaman itu. Item tanpa url (Dashboard, Settings) tetap jadi tab
       in-page lewat "#id". */
    const href = item.url ? item.url : `#${item.id}`;
    return `
      <a href="${href}" class="nav-item ${activeClass}" data-tab="${item.id}">
        ${icon}
        <span>${escapeHTML(item.label)}</span>
      </a>
    `;
  }).join('');

  /* Upgrade banner */
  const upgradeEl = $id('sidebar-upgrade');
  if (upgradeEl) {
    upgradeEl.querySelector('h4').textContent = DASHBOARD_DATA.upgrade.title;
    upgradeEl.querySelector('p').textContent = DASHBOARD_DATA.upgrade.description;
    upgradeEl.querySelector('.btn-upgrade').textContent = DASHBOARD_DATA.upgrade.cta;
  }

  /* Profile */
  const profileEl = $id('sidebar-profile');
  if (profileEl) {
    const user = DASHBOARD_DATA.user;
    profileEl.querySelector('img').src = user.avatar_url;
    profileEl.querySelector('img').alt = user.display_name;
    profileEl.querySelector('h4').textContent = user.display_name;
    profileEl.querySelector('span').textContent = `Level ${user.level}`;
  }
}

/* ========================== TOPBAR ========================== */
function renderTopbar() {
  const user = DASHBOARD_DATA.user;

  const userNameEl = $id('topbar-user-name');
  const userLevelEl = $id('topbar-user-level');
  const userAvatarEl = $id('topbar-avatar');
  const notifBadge = $id('notif-badge');

  if (userNameEl) userNameEl.textContent = user.display_name;
  if (userLevelEl) userLevelEl.textContent = `Level ${user.level}`;
  if (userAvatarEl) { userAvatarEl.src = user.avatar_url; userAvatarEl.alt = user.display_name; }
  if (notifBadge) notifBadge.textContent = DASHBOARD_DATA.notifications.count;
}

/* ========================== HERO BANNER ========================== */
function renderHeroBanner() {
  const user = DASHBOARD_DATA.user;
  const heroTitle = $id('hero-title');
  if (heroTitle) {
    heroTitle.innerHTML = `Welcome back, ${escapeHTML(user.display_name)}! <span class="wave">👋</span>`;
  }
}

/* ========================== STATS ========================== */
function renderStats() {
  const ov = DASHBOARD_DATA.overview;
  const stats = [
    { label: 'Overall Progress', value: `${ov.overall_progress}%`, sub: 'Keep it up!', icon: 'trendUp', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    { label: 'Current Streak', value: `${ov.current_streak} days`, sub: `Best: ${ov.best_streak} days`, icon: 'fire', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { label: 'Completed Lessons', value: String(ov.completed_lessons), sub: 'Total across languages', icon: 'book', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    { label: 'XP Earned', value: fmtCompact(ov.xp_earned), sub: 'Total Experience Points', icon: 'lightning', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
    { label: 'Time Spent', value: ov.time_spent, sub: 'Total Study Time', icon: 'clock', color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)' },
  ];

  const grid = $id('stats-grid');
  if (!grid) return;

  grid.innerHTML = stats.map((s, i) => `
    <div class="stat-card animate-in" style="animation-delay: ${i * 0.05}s">
      <div class="stat-header">
        <div class="stat-icon" style="background:${s.bg};color:${s.color}">
          ${ICONS[s.icon] || ''}
        </div>
        <span>${escapeHTML(s.label)}</span>
      </div>
      <div class="stat-value">${escapeHTML(s.value)}</div>
      <div class="stat-sub">${escapeHTML(s.sub)}</div>
      <div class="sparkline-wrap">
        <canvas class="sparkline" data-index="${i}" width="180" height="32"></canvas>
      </div>
    </div>
  `).join('');
}

/* ========================== LANGUAGE PROGRESS ========================== */
function renderLanguageProgress() {
  const grid = $id('lang-grid');
  if (!grid) return;

  grid.innerHTML = DASHBOARD_DATA.languages.map((lang, i) => {
    const circumference = 2 * Math.PI * 30;
    const offset = circumference - (lang.progress_percent / 100) * circumference;

    return `
      <div class="lang-card animate-in" style="animation-delay: ${i * 0.08}s; --card-accent: ${lang.accent_color}">
        <div class="lang-card-header">
          <div class="lang-info">
            <span class="lang-flag">${lang.flag}</span>
            <div class="lang-name">
              <h4>${escapeHTML(lang.name)}</h4>
              <span>${escapeHTML(lang.native_name)}</span>
            </div>
          </div>
          <span class="lang-level">${escapeHTML(lang.level)}</span>
        </div>

        <div class="lang-progress-wrap">
          <div class="circular-chart">
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle class="circle-bg" cx="36" cy="36" r="30"/>
              <circle class="circle-progress" cx="36" cy="36" r="30"
                stroke="${lang.accent_color}"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${circumference}"
                data-offset="${offset}"/>
            </svg>
            <div class="chart-text" style="color:${lang.accent_color}">${lang.progress_percent}%</div>
          </div>

          <div class="lang-details">
            <div class="detail-row">
              <span>Level</span>
              <span>${escapeHTML(lang.level_label)}</span>
            </div>
            <div class="detail-row">
              <span>Lessons</span>
              <span>${lang.lessons_completed} / ${lang.lessons_total}</span>
            </div>
            <div class="detail-row">
              <span>Streak</span>
              <span class="streak">🔥 ${lang.streak_days} days</span>
            </div>
          </div>
        </div>

        <a href="${lang.url || '#'}" class="lang-btn">
          Continue Learning
          ${ICONS.arrowRight}
        </a>
      </div>
    `;
  }).join('');
}

function animateProgressCircles() {
  $$('.circle-progress').forEach(circle => {
    const offset = circle.dataset.offset;
    if (offset !== undefined) {
      circle.style.strokeDashoffset = offset;
    }
  });
}

/* ========================== RECENT ACTIVITY ========================== */
function renderRecentActivity() {
  const list = $id('activity-list');
  if (!list) return;

  const iconMap = {
    book: { icon: 'book', bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
    check: { icon: 'check', bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
    headphones: { icon: 'headphones', bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6' },
  };

  list.innerHTML = DASHBOARD_DATA.recent_activity.map(item => {
    const cfg = iconMap[item.icon] || iconMap.book;
    return `
      <div class="activity-item">
        <div class="activity-icon" style="background:${cfg.bg};color:${cfg.color}">
          ${ICONS[cfg.icon] || ''}
        </div>
        <div class="activity-meta">
          <h4>${escapeHTML(item.title)}</h4>
          <p>${escapeHTML(item.subtitle)}</p>
        </div>
        <div class="activity-right">
          <span class="time">${escapeHTML(item.time_ago)}</span>
          <span class="xp">+${item.xp_gained} XP</span>
        </div>
      </div>
    `;
  }).join('');
}

/* ========================== QUICK ACTIONS ========================== */
function renderQuickActions() {
  const grid = $id('actions-grid');
  if (!grid) return;

  const actions = DASHBOARD_DATA.quick_actions;
  const iconMap = {
    play: 'play', refresh: 'refresh', target: 'target',
    book: 'book', chart: 'chart'
  };

  grid.innerHTML = actions.map((action, i) => {
    const isFull = action.id === 'progress';
    const iconKey = iconMap[action.icon] || 'play';
    return `
      <button class="action-btn ${isFull ? 'full-width' : ''}">
        <div class="action-icon" style="background:${action.color}20;color:${action.color}">
          ${ICONS[iconKey] || ''}
        </div>
        <div>
          <h4>${escapeHTML(action.label)}</h4>
          <p>${escapeHTML(action.description)}</p>
        </div>
      </button>
    `;
  }).join('');
}

/* ========================== INSIGHTS ========================== */
function renderInsights() {
  const insights = DASHBOARD_DATA.insights;

  const highlight = $id('insight-highlight');
  if (highlight) {
    highlight.querySelector('h4').textContent = insights.streak_message;
    highlight.querySelector('p').textContent = insights.streak_submessage;
  }

  const list = $id('insight-list');
  if (list) {
    list.innerHTML = `
      <div class="insight-item">
        <span class="insight-label">
          ${ICONS.trendUp}
          Most active language
        </span>
        <span class="insight-value">${escapeHTML(insights.most_active_language)}</span>
      </div>
      <div class="insight-item">
        <span class="insight-label">
          ${ICONS.target}
          Weekly goal progress
        </span>
        <span class="insight-value">${insights.weekly_goal_progress}%</span>
      </div>
      <div class="progress-bar-wrap">
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:0%;background:linear-gradient(90deg,#3b82f6,#8b5cf6)" data-width="${insights.weekly_goal_progress}"></div>
        </div>
      </div>
      <div class="insight-item">
        <span class="insight-label">
          ${ICONS.star}
          Next milestone
        </span>
        <span class="insight-value" style="font-size:0.75rem;color:var(--text-secondary)">${escapeHTML(insights.next_milestone)}</span>
      </div>
    `;

    /* Animate progress bar */
    setTimeout(() => {
      const fill = list.querySelector('.progress-bar-fill');
      if (fill) fill.style.width = fill.dataset.width + '%';
    }, 500);
  }
}

/* ========================== SPARKLINES ========================== */
function renderSparklines() {
  const canvases = $$('.sparkline');
  const data = DASHBOARD_DATA.xp_history;

  canvases.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const d = data.slice(-14);
    const max = Math.max(...d);
    const min = Math.min(...d);
    const range = max - min || 1;

    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(59,130,246,0.5)';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    d.forEach((val, i) => {
      const x = (i / (d.length - 1)) * w;
      const y = h - ((val - min) / range) * (h - 4) - 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();

    /* Fill gradient */
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(59,130,246,0.15)');
    grad.addColorStop(1, 'rgba(59,130,246,0)');
    ctx.fillStyle = grad;
    ctx.fill();
  });
}

/* ========================== SWIPE & HOVER SIDEBAR ========================== */

function setupSwipeListeners() {
  const sidebar = $id('sidebar');
  const overlay = $id('sidebar-overlay');
  if (!sidebar) return;

  let touchStartX = 0;
  let touchCurrentX = 0;
  let isSwiping = false;
  const SWIPE_THRESHOLD = 100; // px
  const EDGE_ZONE = 50; // px from left edge to trigger open

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchCurrentX = touchStartX;
    isSwiping = true;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    touchCurrentX = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (!isSwiping) return;
    isSwiping = false;

    const diff = touchCurrentX - touchStartX;

    /* Swipe from left edge → right: open sidebar */
    if (touchStartX < EDGE_ZONE && diff > SWIPE_THRESHOLD) {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('active');
    }

    /* Swipe left → close sidebar (only if sidebar is open) */
    if (diff < -SWIPE_THRESHOLD && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    }
  }, { passive: true });
}

function setupHoverSidebar() {
  /* Only on non-touch devices */
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const edgeTrigger = $id('edge-trigger');
  const sidebar = $id('sidebar');
  const overlay = $id('sidebar-overlay');
  if (!edgeTrigger || !sidebar) return;

  let closeTimeout = null;
  const CLOSE_DELAY = 250; // ms — gives time to move mouse into sidebar

  function openSidebar() {
    clearTimeout(closeTimeout);
    sidebar.classList.add('open');
    /* Overlay only on mobile (<1025px); desktop uses shadow */
    if (overlay && window.innerWidth <= 1024) {
      overlay.classList.add('active');
    }
  }

  function closeSidebar() {
    closeTimeout = setTimeout(() => {
      /* Don't close if mouse is over sidebar or edge trigger */
      if (edgeTrigger.matches(':hover') || sidebar.matches(':hover')) return;
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    }, CLOSE_DELAY);
  }

  edgeTrigger.addEventListener('mouseenter', openSidebar);
  edgeTrigger.addEventListener('mouseleave', closeSidebar);
  sidebar.addEventListener('mouseenter', () => clearTimeout(closeTimeout));
  sidebar.addEventListener('mouseleave', closeSidebar);
}

/* ========================== EVENT LISTENERS ========================== */
function setupEventListeners() {
  /* Mobile menu toggle */
  const menuToggle = $id('menu-toggle');
  const sidebar = $id('sidebar');
  const overlay = $id('sidebar-overlay');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active');
    });
  }

  if (overlay && sidebar) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  /* Sidebar nav clicks */
  $$('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const isPageLink = !item.getAttribute('href').startsWith('#');

      if (isPageLink) {
        /* Halaman asli (jp.html, de.html, dst) — biarkan browser navigasi normal */
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        return;
      }

      e.preventDefault();
      const tab = item.dataset.tab;
      AppState.set('ui.activeTab', tab);

      $$('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      /* Close mobile sidebar */
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    });
  });

  /* Search shortcut */
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = $id('search-input');
      if (searchInput) searchInput.focus();
    }
  });

  /* Swipe & Hover sidebar */
  setupSwipeListeners();
  setupHoverSidebar();
}

/* Export */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initDashboard, renderSidebar, renderStats, renderLanguageProgress };
}

/* ================================================================
   KEJUU NOTIFICATION SYSTEM
   - Menggunakan tombol notification yang SUDAH ADA di index.html
   - Panel dibuat langsung dari JS via innerHTML
   - Default pinned announcement
   - Notification khusus user
   - Broadcast semua user
   - Trigger level up
   - Trigger premium aktif
   - Persistent via localStorage
   - Siap disambungkan ke backend
   ================================================================= */

(() => {
  'use strict';

  /* ================================================================
     CONFIG
     ================================================================= */

  const NOTIF_CONFIG = {
    storagePrefix: 'kejuu_notifications_',

    /*
      false = sekarang jalan lokal dulu.
      true  = nanti kirim event ke backend juga.
    */
    useBackend: false,

    /*
      Ganti dengan endpoint backend KEJUU nanti.
      Contoh:
      POST /api/notifications
    */
    apiEndpoint: '/api/notifications',

    /*
      LINK SOSIAL KEJUU
      Ganti URL di bawah dengan URL resmi KEJUU milikmu.
    */
    socialLinks: {
      github: 'https://github.com/USERNAME',
      instagram: 'https://instagram.com/USERNAME',
      linkedin: 'https://linkedin.com/in/USERNAME',
      whatsapp: 'https://whatsapp.com/channel/XXXXXXXXXXXX'
    }
  };


  /* ================================================================
     ICON
     ================================================================= */

  const NOTIF_ICONS = {
    system: '🔔',
    levelup: '🏆',
    premium: '👑',
    lesson: '📚',
    xp: '⚡',
    streak: '🔥',
    social: '🌐',
    reward: '🎁'
  };


  /* ================================================================
     HELPERS
     ================================================================= */

  const escapeHTML = (value) => {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
  };


  function getCurrentUser() {
    try {
      if (window.AppState?.get) {
        const user = AppState.get('user');
        if (user) return user;
      }
    } catch (_) {}

    if (window.DASHBOARD_DATA?.user) {
      return DASHBOARD_DATA.user;
    }

    if (window.currentUser) {
      return window.currentUser;
    }

    return {
      id: 'guest',
      display_name: 'User'
    };
  }


  function getUserId() {
    const user = getCurrentUser();

    return String(
      user.id ??
      user.user_id ??
      user.username ??
      user.email ??
      user.display_name ??
      'guest'
    );
  }


  function getStorageKey() {
    return NOTIF_CONFIG.storagePrefix + getUserId();
  }


  function createId() {
    return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }


  function nowLabel() {
    return 'Baru saja';
  }


  /* ================================================================
     DEFAULT PINNED MESSAGE
     ================================================================= */

  function createDefaultNotification() {
    return {
      id: 'kejuu_welcome_social',
      type: 'social',
      title: 'Selamat datang di KEJUU! 👋',
      message:
        'Ikuti akun resmi KEJUU untuk mendapatkan update, proyek terbaru, dan komunitas belajar.',
      time: 'Pesan awal',
      read: false,
      pinned: true,
      expanded: false,
      audience: 'all',

      links: [
        {
          brand: 'GitHub',
          icon: 'github',
          url: NOTIF_CONFIG.socialLinks.github
        },
        {
          brand: 'Instagram',
          icon: 'instagram',
          url: NOTIF_CONFIG.socialLinks.instagram
        },
        {
          brand: 'LinkedIn',
          icon: 'linkedin',
          url: NOTIF_CONFIG.socialLinks.linkedin
        },
        {
          brand: 'WhatsApp Channel',
          icon: 'whatsapp',
          url: NOTIF_CONFIG.socialLinks.whatsapp
        }
      ]
    };
  }


  /* ================================================================
     STATE
     ================================================================= */

  let notifications = [];
  let notifPanel = null;


  function loadNotifications() {
    try {
      const saved = localStorage.getItem(getStorageKey());

      notifications = saved
        ? JSON.parse(saved)
        : [];
    } catch (error) {
      console.warn('KEJUU notification load error:', error);
      notifications = [];
    }

    ensureDefaultNotification();
  }


  function saveNotifications() {
    try {
      localStorage.setItem(
        getStorageKey(),
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.warn('KEJUU notification save error:', error);
    }
  }


  function ensureDefaultNotification() {
    const exists = notifications.some(
      notification => notification.id === 'kejuu_welcome_social'
    );

    if (!exists) {
      notifications.push(createDefaultNotification());
      saveNotifications();
    }
  }


  function getUnreadCount() {
    return notifications.filter(
      notification => !notification.read
    ).length;
  }


  /* ================================================================
     CREATE PANEL
     ================================================================= */

  function createNotificationPanel() {
    const notifButton =
      document.querySelector('[aria-label="Notifications"]');

    if (!notifButton) {
      console.warn(
        'KEJUU Notification: tombol Notifications tidak ditemukan.'
      );
      return;
    }

    /* Supaya panel absolute mengikuti topbar */
    const topbarRight = notifButton.parentElement;

    if (topbarRight) {
      topbarRight.style.position = 'relative';
    }

    /* ID lama sengaja dipakai ulang */
    notifButton.id = 'kejuu-notif-button';
    notifButton.setAttribute('aria-expanded', 'false');

    /* Hanya tambahkan panel lewat JS */
    notifPanel = document.createElement('div');

    notifPanel.id = 'kejuu-notif-panel';

    notifPanel.innerHTML = `
      <div class="kejuu-notif-header">
        <div>
          <h3>Notifikasi</h3>
          <span id="kejuu-notif-count">0 baru</span>
        </div>

        <button
          type="button"
          id="kejuu-notif-read-all"
          class="kejuu-notif-read-all"
        >
          Tandai semua
        </button>
      </div>

      <div
        id="kejuu-notif-list"
        class="kejuu-notif-list"
      ></div>
    `;

    topbarRight.appendChild(notifPanel);

    injectNotificationStyles();
  }


  /* ================================================================
     RENDER LIST
     ================================================================= */

  function renderNotifications() {
    const list = document.getElementById('kejuu-notif-list');

    if (!list) return;

    const sorted = [...notifications].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      return 0;
    });

    list.innerHTML = sorted.map(notification => {

      const icon =
        NOTIF_ICONS[notification.type] ||
        NOTIF_ICONS.system;

      const linksHTML =
        notification.links?.length
          ? `
            <div class="kejuu-notif-links">
              ${notification.links.map(link => `
                <a
                  href="${escapeHTML(link.url)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="kejuu-notif-link"
                >
                  <span>${ICONS[link.icon] || escapeHTML(link.icon || '')}</span>
                  <span>${escapeHTML(link.brand)}</span>
                </a>
              `).join('')}
            </div>
          `
          : '';

      return `
        <article
          class="kejuu-notif-item
            ${notification.read ? 'is-read' : 'is-unread'}
            ${notification.pinned ? 'is-pinned' : ''}
            ${notification.expanded ? 'is-expanded' : ''}"
          data-id="${escapeHTML(notification.id)}"
        >

          <button
            type="button"
            class="kejuu-notif-main"
            data-notif-open="${escapeHTML(notification.id)}"
          >

            <div class="kejuu-notif-icon">
              ${icon}
            </div>

            <div class="kejuu-notif-content">

              <div class="kejuu-notif-title-row">

                <h4>
                  ${escapeHTML(notification.title)}
                </h4>

                ${
                  notification.pinned
                    ? `<span class="kejuu-notif-pin">PINNED</span>`
                    : ''
                }

              </div>

              <p>
                ${escapeHTML(notification.message)}
              </p>

              <time>
                ${escapeHTML(notification.time)}
              </time>

            </div>

            ${
              !notification.read
                ? `<span class="kejuu-notif-dot"></span>`
                : ''
            }

          </button>

          ${
            notification.expanded
              ? `
                <div class="kejuu-notif-expanded">
                  ${linksHTML}
                </div>
              `
              : ''
          }

        </article>
      `;
    }).join('');

    updateNotificationBadge();
  }


  /* ================================================================
     BADGE
     ================================================================= */

  function updateNotificationBadge() {
    const badge =
      document.getElementById('notif-badge');

    if (!badge) return;

    const unread = getUnreadCount();

    badge.innerHTML =
      unread > 99
        ? '99+'
        : String(unread);

    badge.style.display =
      unread > 0
        ? 'flex'
        : 'none';
  }


  /* ================================================================
     OPEN / CLOSE
     ================================================================= */

  function openNotifications() {

    if (!notifPanel) return;

    notifPanel.classList.add('open');

    const button =
      document.getElementById('kejuu-notif-button');

    button?.classList.add('open');
    button?.setAttribute('aria-expanded', 'true');
  }


  function closeNotifications() {

    if (!notifPanel) return;

    notifPanel.classList.remove('open');

    const button =
      document.getElementById('kejuu-notif-button');

    button?.classList.remove('open');
    button?.setAttribute('aria-expanded', 'false');
  }


  function toggleNotifications() {

    if (!notifPanel) return;

    notifPanel.classList.contains('open')
      ? closeNotifications()
      : openNotifications();
  }


  /* ================================================================
     MARK READ
     ================================================================= */

  function markAsRead(id) {

    const notification =
      notifications.find(item => item.id === id);

    if (!notification) return;

    notification.read = true;

    saveNotifications();
    renderNotifications();
  }


  function markAllAsRead() {

    notifications.forEach(
      notification => {
        notification.read = true;
      }
    );

    saveNotifications();
    renderNotifications();
  }


  /* ================================================================
     ADD NOTIFICATION
     ================================================================= */

  function addNotification({
    id = createId(),
    type = 'system',
    title,
    message,
    audience = 'user',
    userId = getUserId(),
    pinned = false,
    links = [],
    read = false
  }) {

    if (!title) return null;

    const notification = {
      id,
      type,
      title,
      message,
      audience,
      userId,
      pinned,
      expanded: false,
      links,
      time: nowLabel(),
      read
    };

    notifications.unshift(notification);

    saveNotifications();
    renderNotifications();

    /* Bell animation */
    const button =
      document.getElementById('kejuu-notif-button');

    if (button) {
      button.classList.remove('kejuu-notif-shake');

      void button.offsetWidth;

      button.classList.add('kejuu-notif-shake');
    }

    return notification;
  }


  /* ================================================================
     USER NOTIFICATION
     ================================================================= */

  function notifyUser({
    userId = getUserId(),
    type = 'system',
    title,
    message,
    pinned = false,
    links = []
  }) {

    /*
      Di frontend, hanya notifikasi untuk user aktif
      yang dimasukkan ke storage browser ini.
    */
    if (String(userId) !== String(getUserId())) {
      return null;
    }

    const notification = addNotification({
      type,
      title,
      message,
      audience: 'user',
      userId,
      pinned,
      links
    });

    sendToBackend({
      audience: 'user',
      userId,
      type,
      title,
      message,
      pinned
    });

    return notification;
  }


  /* ================================================================
     ALL USER / BROADCAST
     ================================================================= */

  function notifyAll({
    type = 'system',
    title,
    message,
    pinned = false,
    links = []
  }) {

    /*
      Untuk browser user yang sedang aktif,
      langsung tampil sekarang.
    */
    const notification = addNotification({
      type,
      title,
      message,
      audience: 'all',
      pinned,
      links
    });

    /*
      Untuk benar-benar mengirim ke SEMUA user,
      backend harus menyimpan / mendistribusikan event ini.
    */
    sendToBackend({
      audience: 'all',
      type,
      title,
      message,
      pinned
    });

    return notification;
  }


  /* ================================================================
     LEVEL UP TRIGGER
     ================================================================= */

  function triggerLevelUp(newLevel) {

    const user =
      getCurrentUser();

    return notifyUser({
      type: 'levelup',

      title: 'Naik Level! 🏆',

      message:
        `Selamat ${user.display_name || ''}! ` +
        `Kamu sekarang mencapai Level ${newLevel}. ` +
        `Teruskan perjalanan belajarmu!`
    });
  }


  /* ================================================================
     PREMIUM ACTIVATED TRIGGER
     ================================================================= */

  function triggerPremiumActivated(plan = 'Premium') {

    const user =
      getCurrentUser();

    return notifyUser({
      type: 'premium',

      title:
        'Pembelian Premium telah aktif! 👑',

      message:
        `Halo ${user.display_name || ''}! ` +
        `Paket ${plan} kamu sudah aktif. ` +
        `Fitur premium sekarang dapat digunakan.`
    });
  }


  /* ================================================================
     OTHER READY-TO-USE TRIGGERS
     ================================================================= */

  function triggerLessonCompleted(lessonName, xp = 0) {

    return notifyUser({
      type: 'lesson',

      title:
        'Pelajaran selesai! 📚',

      message:
        `${lessonName} berhasil diselesaikan. ` +
        `Kamu mendapatkan +${xp} XP.`
    });
  }


  function triggerStreak(streak) {

    return notifyUser({
      type: 'streak',

      title:
        `Streak ${streak} hari! 🔥`,

      message:
        `Keren! Kamu sudah belajar selama ${streak} hari berturut-turut.`
    });
  }


  function triggerXP(xp) {

    return notifyUser({
      type: 'xp',

      title:
        'XP bertambah! ⚡',

      message:
        `Kamu mendapatkan +${xp} XP dari aktivitas belajarmu.`
    });
  }


  /* ================================================================
     BACKEND HOOK
     ================================================================= */

  async function sendToBackend(payload) {

    if (!NOTIF_CONFIG.useBackend) {
      return;
    }

    try {

      await fetch(
        NOTIF_CONFIG.apiEndpoint,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          credentials: 'include',

          body: JSON.stringify(payload)
        }
      );

    } catch (error) {

      console.warn(
        'KEJUU notification backend error:',
        error
      );

    }
  }


  /* ================================================================
     CLICK EVENTS
     ================================================================= */

  function setupNotificationEvents() {

    const button =
      document.getElementById('kejuu-notif-button');

    const list =
      document.getElementById('kejuu-notif-list');

    const readAllButton =
      document.getElementById('kejuu-notif-read-all');


    /* Notification button */
    button?.addEventListener(
      'click',
      (event) => {

        event.stopPropagation();

        toggleNotifications();
      }
    );


    /* Mark all */
    readAllButton?.addEventListener(
      'click',
      (event) => {

        event.stopPropagation();

        markAllAsRead();
      }
    );


    /* Notification item */
    list?.addEventListener(
      'click',
      (event) => {

        const openButton =
          event.target.closest('[data-notif-open]');

        if (!openButton) return;

        event.stopPropagation();

        const id =
          openButton.dataset.notifOpen;

        const notification =
          notifications.find(
            item => item.id === id
          );

        if (!notification) return;


        /*
          Pinned message:
          klik pertama = buka isi / social links
        */
        if (
          notification.pinned &&
          notification.links?.length
        ) {

          notification.expanded =
            !notification.expanded;

        }

        /* Semua notif otomatis dianggap sudah dilihat */
        notification.read = true;

        saveNotifications();
        renderNotifications();
      }
    );


    /* Klik link social jangan menutup panel */
    list?.addEventListener(
      'click',
      (event) => {

        const link =
          event.target.closest('.kejuu-notif-link');

        if (link) {
          event.stopPropagation();
        }
      }
    );


    /* Klik di luar */
    document.addEventListener(
      'click',
      (event) => {

        if (
          notifPanel &&
          !notifPanel.contains(event.target) &&
          !button?.contains(event.target)
        ) {
          closeNotifications();
        }
      }
    );


    /* ESC */
    document.addEventListener(
      'keydown',
      (event) => {

        if (
          event.key === 'Escape' &&
          notifPanel?.classList.contains('open')
        ) {
          closeNotifications();
        }
      }
    );
  }


  /* ================================================================
     CSS VIA JS
     ================================================================= */

  function injectNotificationStyles() {

    if (
      document.getElementById(
        'kejuu-notification-styles'
      )
    ) {
      return;
    }

    const style =
      document.createElement('style');

    style.id =
      'kejuu-notification-styles';

    style.innerHTML = `
      #kejuu-notif-panel {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        width: min(390px, calc(100vw - 24px));
        max-height: min(620px, calc(100vh - 90px));
        display: none;
        flex-direction: column;
        overflow: hidden;
        z-index: 9999;

        background: var(--bg-2, #1b1b28);
        border: 1px solid var(--line, rgba(255,255,255,.08));
        border-radius: 16px;
        box-shadow: 0 18px 50px rgba(0,0,0,.35);
      }

      #kejuu-notif-panel.open {
        display: flex;
      }

      .kejuu-notif-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 16px;
        border-bottom: 1px solid var(--line, rgba(255,255,255,.08));
      }

      .kejuu-notif-header h3 {
        margin: 0;
        font-size: 1rem;
        color: var(--text, #f4f4f5);
      }

      .kejuu-notif-header span {
        display: block;
        margin-top: 3px;
        font-size: .72rem;
        color: var(--text-muted, #92929d);
      }

      .kejuu-notif-read-all {
        border: 0;
        background: transparent;
        color: var(--accent, #40e0d0);
        cursor: pointer;
        font-size: .72rem;
        white-space: nowrap;
      }

      .kejuu-notif-list {
        overflow-y: auto;
      }

      .kejuu-notif-item {
        border-bottom: 1px solid var(--line, rgba(255,255,255,.06));
      }

      .kejuu-notif-item:last-child {
        border-bottom: 0;
      }

      .kejuu-notif-item.is-unread {
        background: rgba(64,224,208,.045);
      }

      .kejuu-notif-item.is-pinned {
        background: rgba(155,140,240,.08);
      }

      .kejuu-notif-main {
        width: 100%;
        display: flex;
        gap: 12px;
        align-items: flex-start;
        padding: 14px 16px;
        border: 0;
        background: transparent;
        color: inherit;
        text-align: left;
        cursor: pointer;
      }

      .kejuu-notif-main:hover {
        background: rgba(255,255,255,.035);
      }

      .kejuu-notif-icon {
        width: 34px;
        height: 34px;
        flex: 0 0 34px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: rgba(255,255,255,.06);
      }

      .kejuu-notif-content {
        min-width: 0;
        flex: 1;
      }

      .kejuu-notif-title-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 7px;
      }

      .kejuu-notif-content h4 {
        margin: 0;
        font-size: .82rem;
        color: var(--text, #f4f4f5);
      }

      .kejuu-notif-content p {
        margin: 5px 0 6px;
        font-size: .76rem;
        line-height: 1.5;
        color: var(--text-secondary, #c3c3cc);
      }

      .kejuu-notif-content time {
        font-size: .67rem;
        color: var(--text-muted, #8e8e99);
      }

      .kejuu-notif-pin {
        font-size: .57rem;
        padding: 3px 6px;
        border-radius: 999px;
        background: rgba(155,140,240,.18);
        color: #cf3434;
      }

      .kejuu-notif-dot {
        width: 7px;
        height: 7px;
        flex: 0 0 7px;
        margin-top: 6px;
        border-radius: 50%;
        background: var(--accent, #40e0d0);
      }

      .kejuu-notif-expanded {
        padding: 0 16px 15px 62px;
      }

      .kejuu-notif-links {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .kejuu-notif-link {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 9px 10px;
        border-radius: 9px;
        background: rgba(255,255,255,.045);
        color: var(--text, #f4f4f5);
        text-decoration: none;
        font-size: .72rem;
      }

      .kejuu-notif-link:hover {
        background: rgba(255,255,255,.08);
      }

      @keyframes kejuuNotifShake {
        0% { transform: rotate(0); }
        20% { transform: rotate(-10deg); }
        40% { transform: rotate(10deg); }
        60% { transform: rotate(-7deg); }
        80% { transform: rotate(7deg); }
        100% { transform: rotate(0); }
      }

      #kejuu-notif-button.kejuu-notif-shake {
        animation: kejuuNotifShake .45s ease;
      }

      @media (max-width: 600px) {
        #kejuu-notif-panel {
          position: fixed;
          top: 64px;
          right: 12px;
          left: 12px;
          width: auto;
          max-height: calc(100vh - 82px);
        }

        .kejuu-notif-links {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }


  /* ================================================================
     INIT
     ================================================================= */

  function initNotifications() {

    loadNotifications();

    createNotificationPanel();

    renderNotifications();

    setupNotificationEvents();
  }


  /* ================================================================
     PUBLIC API
     ================================================================ */

  window.KEJUUNotifications = {

    /* Basic */
    add: addNotification,

    /* User-specific */
    user: notifyUser,

    /* Broadcast */
    all: notifyAll,

    /* Automatic triggers */
    levelUp: triggerLevelUp,
    premiumActivated: triggerPremiumActivated,
    lessonCompleted: triggerLessonCompleted,
    streak: triggerStreak,
    xp: triggerXP,

    /* Utility */
    markRead: markAsRead,
    markAllRead: markAllAsRead,

    getAll: () => [...notifications],
    getUnreadCount
  };


  /* ================================================================
     START
     ================================================================= */

  if (document.readyState === 'loading') {

    document.addEventListener(
      'DOMContentLoaded',
      initNotifications
    );

  } else {

    initNotifications();

  }

})();