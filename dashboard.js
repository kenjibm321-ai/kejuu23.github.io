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
  const SWIPE_THRESHOLD = 80; // px
  const EDGE_ZONE = 40; // px from left edge to trigger open

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
