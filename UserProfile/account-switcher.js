/* =================================================================
   ACCOUNT-SWITCHER.JS — Dropdown "Akun" ala sosial media
   Trigger: #sidebar-profile (baris profil di bagian bawah sidebar)
   Uses:
     - escapeHTML() dari core/utils.js
     - window.KejuuAuth dari Auth/auth.js (WAJIB dimuat sebelum file ini)

   Perilaku (Opsi A — 1 sesi aktif dalam satu waktu):
     - Belum login  -> tampil akun "Tamu" + tombol "Masuk / Daftar"
     - Sudah login  -> tampil akun asli + tombol "Keluar"
   ================================================================= */

(() => {
  "use strict";

  const TRIGGER_SELECTOR = "#sidebar-profile";

  let menuEl = null;
  let isOpen = false;

  const safe = (typeof escapeHTML === "function")
    ? escapeHTML
    : (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
      }[c]));

  /* =========================================================
     RENDER POPOVER
     ========================================================= */
  function buildMenu() {
    const el = document.createElement("div");
    el.className = "account-switcher";
    el.setAttribute("role", "menu");
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
    return el;
  }

  function renderMenu() {
    const account = window.KejuuAuth ? window.KejuuAuth.getCurrentAccount() : null;

    if (!account) {
      menuEl.innerHTML = `<div class="account-switcher__header">Memuat akun...</div>`;
      return;
    }

    menuEl.innerHTML = `
      <div class="account-switcher__header">${account.isGuest ? "Belum masuk akun" : "Akun aktif"}</div>
      <ul class="account-switcher__list">
        <li>
          <div class="account-switcher__item is-active" role="menuitemradio" aria-checked="true">
            <img class="account-switcher__avatar" src="${safe(account.avatar)}" alt="${safe(account.name)}">
            <span class="account-switcher__meta">
              <strong>${safe(account.name)}</strong>
              <small>${safe(account.email || account.level)}</small>
            </span>
            <svg class="account-switcher__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </li>
      </ul>
      <div class="account-switcher__footer">
        ${account.isGuest ? `
          <button type="button" class="account-switcher__add" data-auth-open>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Masuk / Daftar akun
          </button>
        ` : `
          <button type="button" class="account-switcher__add" data-auth-logout>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Keluar, ganti akun lain
          </button>
        `}
      </div>
    `;

    const authOpenBtn = menuEl.querySelector("[data-auth-open]");
    if (authOpenBtn) {
      authOpenBtn.addEventListener("click", () => {
        closeMenu();
        window.AuthModal?.open("login");
      });
    }

    const logoutBtn = menuEl.querySelector("[data-auth-logout]");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        logoutBtn.disabled = true;
        try {
          await window.KejuuAuth.signOut();
        } catch (error) {
          console.error("[AccountSwitcher] Gagal keluar:", error);
        } finally {
          closeMenu();
        }
      });
    }
  }

  /* =========================================================
     POSISI POPOVER (mengikuti posisi trigger, muncul ke atas
     karena trigger ada di bagian paling bawah sidebar)
     ========================================================= */
  function positionMenu() {
    const trigger = document.querySelector(TRIGGER_SELECTOR);
    if (!trigger || !menuEl) return;

    const rect = trigger.getBoundingClientRect();
    const gap = 8;

    menuEl.style.left = `${Math.round(rect.left)}px`;
    menuEl.style.width = `${Math.round(rect.width)}px`;
    menuEl.style.bottom = `${Math.round(window.innerHeight - rect.top + gap)}px`;
    menuEl.style.top = "auto";
  }

  /* =========================================================
     BUKA / TUTUP
     ========================================================= */
  function openMenu() {
    if (!menuEl) menuEl = buildMenu();
    renderMenu();
    positionMenu();

    requestAnimationFrame(() => {
      menuEl.classList.add("is-open");
      menuEl.setAttribute("aria-hidden", "false");
    });

    isOpen = true;
    document.addEventListener("click", handleOutsideClick, true);
    window.addEventListener("resize", positionMenu);
    document.addEventListener("keydown", handleEscape);
  }

  function closeMenu() {
    if (!menuEl) return;
    menuEl.classList.remove("is-open");
    menuEl.setAttribute("aria-hidden", "true");
    isOpen = false;
    document.removeEventListener("click", handleOutsideClick, true);
    window.removeEventListener("resize", positionMenu);
    document.removeEventListener("keydown", handleEscape);
  }

  function toggleMenu() {
    if (isOpen) closeMenu();
    else openMenu();
  }

  function handleOutsideClick(event) {
    const trigger = document.querySelector(TRIGGER_SELECTOR);
    if (menuEl.contains(event.target) || trigger?.contains(event.target)) return;
    closeMenu();
  }

  function handleEscape(event) {
    if (event.key === "Escape") closeMenu();
  }

  /* =========================================================
     INIT
     ========================================================= */
  function init() {
    const trigger = document.querySelector(TRIGGER_SELECTOR);
    if (!trigger) return;

    trigger.setAttribute("aria-haspopup", "menu");
    trigger.setAttribute("aria-expanded", "false");

    trigger.addEventListener("click", event => {
      event.preventDefault();
      toggleMenu();
      trigger.setAttribute("aria-expanded", String(isOpen));
    });

    /* Kalau menu lagi kebuka pas akun berubah (habis login/logout),
       render ulang biar konten popover ikut update. */
    document.addEventListener("kejuu:auth-changed", () => {
      if (isOpen) renderMenu();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
