/* =================================================================
   CONTOH PEMASANGAN — sesuaikan dengan file route kamu yang sudah ada
   (mis. routes/users.js atau langsung di server.js / index.js)
   ================================================================= */

const { requireAuth } = require("./middleware/authMiddleware");

/* SEBELUM — endpoint ini kebuka buat siapa aja yang tau ID user:
   app.get("/api/users/:id", (req, res) => { ... });
*/

/* SESUDAH — wajib login DAN cuma boleh akses data diri sendiri */
app.get("/api/users/:id", requireAuth, (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: "Tidak boleh mengakses data user lain." });
  }

  // ... lanjut logic ambil data user seperti biasa
});

app.get("/api/users/:id/profile", requireAuth, (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: "Tidak boleh mengakses data user lain." });
  }
  // ... lanjut logic
});

app.get("/api/users/:id/progress", requireAuth, (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: "Tidak boleh mengakses data user lain." });
  }
  // ... lanjut logic
});

app.put("/api/users/:id", requireAuth, (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: "Tidak boleh mengubah data user lain." });
  }
  // ... lanjut logic update
});

/* Kalau ada endpoint publik (misal daftar leaderboard yang boleh
   dilihat tamu tapi personalisasi kalau login), pakai optionalAuth: */
const { optionalAuth } = require("./middleware/authMiddleware");

app.get("/api/leaderboard", optionalAuth, (req, res) => {
  const isLoggedIn = !!req.user;
  // ... tampilkan leaderboard, highlight posisi req.user kalau ada
});
