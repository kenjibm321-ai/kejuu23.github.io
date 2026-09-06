/* =================================================================
   authMiddleware.js — Verifikasi token Supabase di backend Railway
   Taruh file ini di folder middleware/ project Express kamu.

   Cara pasang env var di Railway:
     Project → Variables → tambahin:
       SUPABASE_URL      = https://jlusnosbkvjarlbadxme.supabase.co
       SUPABASE_ANON_KEY = (anon/publishable key yang sama kayak di front-end)

   Install dependency (kalau belum ada fetch bawaan Node versimu):
     npm install node-fetch   // hanya perlu kalau Node < 18
   ================================================================= */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

/**
 * Middleware WAJIB login. Pasang di route yang butuh data pribadi user.
 * Kalau token valid -> req.user = { id, email, ... } dari Supabase.
 * Kalau tidak ada / tidak valid -> balas 401, request dihentikan.
 */
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Belum login. Sertakan token di header Authorization." });
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "apikey": SUPABASE_ANON_KEY,
      },
    });

    if (!response.ok) {
      return res.status(401).json({ error: "Token tidak valid atau sudah kadaluarsa." });
    }

    req.user = await response.json(); // { id, email, user_metadata, ... }
    next();
  } catch (error) {
    console.error("[authMiddleware] Gagal verifikasi token ke Supabase:", error);
    return res.status(500).json({ error: "Gagal memverifikasi sesi. Coba lagi." });
  }
}

/**
 * Middleware OPSIONAL login. Dipakai untuk endpoint yang boleh diakses
 * tamu maupun user login, tapi kalau ada token, tetap divalidasi dan
 * req.user diisi. Tidak menghentikan request kalau tokennya kosong.
 */
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "apikey": SUPABASE_ANON_KEY,
      },
    });
    req.user = response.ok ? await response.json() : null;
  } catch (error) {
    console.error("[optionalAuth] Gagal verifikasi token:", error);
    req.user = null;
  }

  next();
}

module.exports = { requireAuth, optionalAuth };
