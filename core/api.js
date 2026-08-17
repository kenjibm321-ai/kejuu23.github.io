/* =================================================================
   API.JS — Centralized HTTP Layer for Supabase / Railway
   All backend communication goes through here.
   ================================================================= */

/* ── Configuration ── */
const API_BASE_URL = "https://kejuu23githubio-production.up.railway.app/";
const SUPABASE_URL = "https://jlusnosbkvjarlbadxme.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_C3Io5MlR2qah5mIQXLMdGQ_rUJjnzZE";

/* ── Generic fetch wrapper ── */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  const config = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  };

  if (options.body instanceof FormData || options.body instanceof Blob) {
    delete config.headers["Content-Type"];
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const err = new Error(`HTTP ${response.status}: ${response.statusText}`);
      err.status = response.status;
      err.endpoint = endpoint;
      try { err.data = await response.json(); } catch { err.data = null; }
      throw err;
    }
    if (response.status === 204) return null;
    return await response.json();
  } catch (networkErr) {
    if (!networkErr.status) {
      networkErr.message = `Network error calling ${endpoint}: ${networkErr.message}`;
    }
    throw networkErr;
  }
}

/* ── Convenience HTTP verbs ── */
const api = {
  get: (endpoint, opts = {}) => apiFetch(endpoint, { method: "GET", ...opts }),
  post: (endpoint, body, opts = {}) => apiFetch(endpoint, { method: "POST", body: JSON.stringify(body), ...opts }),
  put: (endpoint, body, opts = {}) => apiFetch(endpoint, { method: "PUT", body: JSON.stringify(body), ...opts }),
  patch: (endpoint, body, opts = {}) => apiFetch(endpoint, { method: "PATCH", body: JSON.stringify(body), ...opts }),
  del: (endpoint, opts = {}) => apiFetch(endpoint, { method: "DELETE", ...opts }),
};

/* ── Railway User API ── */
const userAPI = {
  getAll: () => api.get("/api/users"),
  getById: (id) => api.get(`/api/users/${id}`),
  getProfile: (id) => api.get(`/api/users/${id}/profile`),
  getProgress: (id) => api.get(`/api/users/${id}/progress`),
  create: (data) => api.post("/api/users", data),
  update: (id, data) => api.put(`/api/users/${id}`, data),
  remove: (id) => api.del(`/api/users/${id}`),
};

/* ── Supabase REST API ── */
const supabaseAPI = {
  /* Generic query builder */
  async query(table, { select = "*", eq, order, limit } = {}) {
    let url = `${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(select)}`;
    if (eq) url += `&${eq.column}=eq.${encodeURIComponent(eq.value)}`;
    if (order) url += `&order=${order.column}.${order.direction || "asc"}`;
    if (limit) url += `&limit=${limit}`;

    const res = await fetch(url, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error(`Supabase ${table}: ${res.status}`);
    return res.json();
  },

  /* Table-specific helpers */
  getUsers: () => supabaseAPI.query("users"),
  getUserById: (id) => supabaseAPI.query("users", { eq: { column: "id", value: id } }),
  getProfiles: () => supabaseAPI.query("profiles"),
  getProfileByUserId: (userId) => supabaseAPI.query("profiles", { eq: { column: "user_id", value: userId } }),
  getProgress: (userId) => supabaseAPI.query("progress", { eq: { column: "user_id", value: userId } }),
  getUserProgress: (userId) => supabaseAPI.query("user_progress", { eq: { column: "user_id", value: userId } }),
  getVocabulary: (lang) => supabaseAPI.query("vocabulary", lang ? { eq: { column: "language", value: lang } } : {}),
  getAssets: () => supabaseAPI.query("assets", { eq: { column: "is_active", value: true } }),
};

/* ── Dashboard data fetcher (uses mock if API not ready) ── */
async function fetchDashboardData(userId) {
  /* Try Railway first, fallback to mock */
  try {
    const [user, profile, progress, userProgress] = await Promise.all([
      userAPI.getById(userId),
      userAPI.getProfile(userId),
      userAPI.getProgress(userId),
      userAPI.getProgress(userId), // user_progress endpoint
    ]);
    return { user, profile, progress, userProgress, source: "railway" };
  } catch (err) {
    console.warn("Railway API unavailable, using mock data:", err.message);
    /* Return mock data structure */
    return {
      user: DASHBOARD_DATA.user,
      profile: { display_name: DASHBOARD_DATA.user.display_name, bio: "", avatar_url: DASHBOARD_DATA.user.avatar_url },
      progress: DASHBOARD_DATA.overview,
      userProgress: DASHBOARD_DATA.languages,
      source: "mock"
    };
  }
}

/* Export */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_BASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY, apiFetch, api, userAPI, supabaseAPI, fetchDashboardData };
}
