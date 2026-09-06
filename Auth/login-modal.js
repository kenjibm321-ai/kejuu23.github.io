/* =================================================================
   LOGIN-MODAL.JS — Popup Login / Daftar
   Uses: window.KejuuAuth (dari Auth/auth.js), escapeHTML (core/utils.js)

   Catatan: backend Kejuu pakai USERNAME + PASSWORD (bukan email),
   jadi form ini cuma minta 2 field itu untuk login maupun daftar.
   ================================================================= */

(() => {
  "use strict";

  let rootEl = null;
  let activeTab = "login"; // 'login' | 'signup'

  function build() {
    const el = document.createElement("div");
    el.className = "auth-modal";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = `
      <div class="auth-modal__overlay" data-auth-overlay></div>
      <div class="auth-modal__card" role="dialog" aria-modal="true" aria-label="Masuk atau daftar akun">
        <button type="button" class="auth-modal__close" data-auth-close aria-label="Tutup">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>

        <div class="auth-modal__tabs">
          <button type="button" class="auth-modal__tab" data-auth-tab="login">Masuk</button>
          <button type="button" class="auth-modal__tab" data-auth-tab="signup">Daftar</button>
        </div>

        <form class="auth-modal__form" data-auth-form novalidate>
          <div class="auth-modal__field">
            <label for="auth-username">Username</label>
            <input id="auth-username" type="text" name="username" autocomplete="username" placeholder="Minimal 3 karakter" required minlength="3">
          </div>

          <div class="auth-modal__field">
            <label for="auth-password">Kata sandi</label>
            <input id="auth-password" type="password" name="password" autocomplete="current-password" placeholder="Minimal 6 karakter" required minlength="6">
          </div>

          <p class="auth-modal__error" data-auth-error hidden></p>

          <button type="submit" class="auth-modal__submit" data-auth-submit>Masuk</button>
        </form>
      </div>
    `;

    document.body.appendChild(el);
    return el;
  }

  function setTab(tab) {
    activeTab = tab;
    const form = rootEl.querySelector("[data-auth-form]");
    const submitBtn = rootEl.querySelector("[data-auth-submit]");
    const passwordInput = rootEl.querySelector("#auth-password");

    rootEl.querySelectorAll("[data-auth-tab]").forEach(tabBtn => {
      tabBtn.classList.toggle("is-active", tabBtn.dataset.authTab === tab);
    });

    const isSignup = tab === "signup";
    submitBtn.textContent = isSignup ? "Daftar" : "Masuk";
    passwordInput.autocomplete = isSignup ? "new-password" : "current-password";

    clearError();
    form.reset();
  }

  function showError(message) {
    const errorEl = rootEl.querySelector("[data-auth-error]");
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function clearError() {
    const errorEl = rootEl.querySelector("[data-auth-error]");
    errorEl.hidden = true;
    errorEl.textContent = "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    clearError();

    const form = event.target;
    const submitBtn = rootEl.querySelector("[data-auth-submit]");
    const username = form.username.value.trim();
    const password = form.password.value;

    submitBtn.disabled = true;
    submitBtn.textContent = "Memproses...";

    try {
      if (activeTab === "signup") {
        await window.KejuuAuth.signUp({ username, password });
      } else {
        await window.KejuuAuth.signIn({ username, password });
      }
      close();
    } catch (error) {
      showError(error?.message || "Terjadi kesalahan, coba lagi.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = activeTab === "signup" ? "Daftar" : "Masuk";
    }
  }

  function open(tab = "login") {
    if (!rootEl) {
      rootEl = build();
      rootEl.querySelector("[data-auth-overlay]").addEventListener("click", close);
      rootEl.querySelector("[data-auth-close]").addEventListener("click", close);
      rootEl.querySelectorAll("[data-auth-tab]").forEach(btn => {
        btn.addEventListener("click", () => setTab(btn.dataset.authTab));
      });
      rootEl.querySelector("[data-auth-form]").addEventListener("submit", handleSubmit);
      document.addEventListener("keydown", event => {
        if (event.key === "Escape" && rootEl.classList.contains("is-open")) close();
      });
    }

    setTab(tab);
    requestAnimationFrame(() => {
      rootEl.classList.add("is-open");
      rootEl.setAttribute("aria-hidden", "false");
    });
  }

  function close() {
    if (!rootEl) return;
    rootEl.classList.remove("is-open");
    rootEl.setAttribute("aria-hidden", "true");
  }

  window.AuthModal = { open, close };
})();
