/* =================================================================
   AUTH.JS — Wrapper ke backend sendiri (Express + PostgreSQL di Railway)

   PENTING: backend Kejuu TIDAK pakai Supabase Auth. Supabase di project
   ini cuma dipakai buat data lain (vocabulary/assets) lewat anon key,
   bukan buat akun user. Login/register/JWT semuanya lewat server.js
   sendiri (endpoint /api/auth/...).

   Uses: API_BASE_URL dari core/api.js (harus dimuat sebelum file ini)

   Konsep "Opsi A" yang disepakati:
   - Selalu ada 1 akun AKTIF dalam satu waktu.
   - Belum login -> akun aktif = GUEST_ACCOUNT (Tamu).
   - Sudah login -> akun aktif = data dari backend + JWT tersimpan.
   - "Ganti akun" = logout dari sesi sekarang, lalu login lagi.
   ================================================================= */

(() => {
  "use strict";

  const TOKEN_KEY = "kejuu.auth.token";

  const GUEST_ACCOUNT = {
    id: "guest",
    name: "Tamu",
    level: "Belum masuk akun",
    avatar: "source/assets/avatar.png",
    isGuest: true,
  };

  let currentAccount = GUEST_ACCOUNT;
  const listeners = new Set();

  /* =========================================================
     TOKEN STORAGE
     ========================================================= */
  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY); }
    catch { return null; }
  }

  function setToken(token) {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error("[Auth] Gagal menyimpan token:", error);
    }
  }

  /* Dipakai core/api.js buat nempelin header Authorization. */
  async function getAccessToken() {
    return getToken();
  }

  /* =========================================================
     BANGUN OBJEK AKUN DARI RESPONS BACKEND
     ========================================================= */
  function accountFromUser(user, profile) {
    return {
      id: String(user.id),
      name: profile?.display_name || user.username,
      level: "Level 1",
      avatar: profile?.avatar_url || "source/assets/avatar.png",
      email: user.email || "",
      username: user.username,
      isGuest: false,
    };
  }

  /* =========================================================
     TERAPKAN KE SIDEBAR & TOPBAR
     Ini yang tadinya KELEWAT — sidebar bawah & topbar nggak
     pernah kebaruin walau sudah login, karena cuma event yang
     didengerin oleh profile.js (panel profil gede), bukan
     elemen visible di sidebar/topbar itu sendiri.
     ========================================================= */
  function applyAccountToChrome(account) {
    document.querySelectorAll("#sidebar-profile img, #topbar-avatar").forEach(img => {
      img.src = account.avatar;
      img.alt = account.name;
    });
    document.querySelectorAll("#sidebar-profile .profile-info h4, #topbar-user-name").forEach(el => {
      el.textContent = account.name;
    });
    document.querySelectorAll("#sidebar-profile .profile-info span, #topbar-user-level").forEach(el => {
      el.textContent = account.level;
    });
  }

  /* =========================================================
     NOTIFY — sebarkan perubahan akun ke seluruh UI
     ========================================================= */
  function setCurrentAccount(account) {
    currentAccount = account;

    const applyChrome = () => applyAccountToChrome(account);
    applyChrome();
    /* Jaga-jaga: dashboard.js render sidebar/topbar pakai data dummy
       tepat sesudah ini di alur DOMContentLoaded yang sama. Timeout 0
       ini nunda sedikit biar tulisan akun asli/"Tamu" yang menang,
       bukan ketiban data dummy dashboard.js. */
    setTimeout(applyChrome, 0);

    listeners.forEach(fn => {
      try { fn(account); } catch (error) { console.error("[Auth] listener error:", error); }
    });

    document.dispatchEvent(new CustomEvent("kejuu:profile-updated", {
      detail: { displayName: account.name, avatar: account.avatar },
    }));

    document.dispatchEvent(new CustomEvent("kejuu:auth-changed", {
      detail: { account },
    }));
  }

  /* =========================================================
     HELPER — panggil backend sendiri
     ========================================================= */
  async function callAuthEndpoint(endpoint, body) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      const message = data.message || `Gagal memproses permintaan (${res.status})`;
      throw new Error(message);
    }

    return data;
  }

  /* =========================================================
     PUBLIC API
     ========================================================= */
  async function signUp({ username, password }) {
    const data = await callAuthEndpoint("/api/auth/register", { username, password });
    setToken(data.token);
    setCurrentAccount(accountFromUser(data.user));
    return data;
  }

  async function signIn({ username, password }) {
    const data = await callAuthEndpoint("/api/auth/login", { username, password });
    setToken(data.token);
    setCurrentAccount(accountFromUser(data.user));
    return data;
  }

  async function signOut() {
    setToken(null);
    setCurrentAccount(GUEST_ACCOUNT);
  }

  function getCurrentAccount() {
    return currentAccount;
  }

  function onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  /* =========================================================
     INIT — cek token tersimpan (mis. abis refresh halaman)
     ========================================================= */
  async function init() {
    const token = getToken();

    if (!token) {
      setCurrentAccount(GUEST_ACCOUNT);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setToken(null);
        setCurrentAccount(GUEST_ACCOUNT);
        return;
      }

      let profile = null;
      try {
        const profileRes = await fetch(`${API_BASE_URL}/api/users/${data.user.id}/profile`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const profileData = await profileRes.json();
        if (profileRes.ok && profileData.success) profile = profileData.profile;
      } catch {
        // Profile gagal diambil, tetap lanjut pakai data user dasar
      }

      setCurrentAccount(accountFromUser(data.user, profile));
    } catch (error) {
      console.error("[Auth] Gagal memuat sesi:", error);
      setCurrentAccount(GUEST_ACCOUNT);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.KejuuAuth = {
    signUp,
    signIn,
    signOut,
    getCurrentAccount,
    getAccessToken,
    onChange,
    GUEST_ACCOUNT,
  };
})();
