const express = require("express");
const pool = require("./db");

const app = express();

// Railway menyediakan PORT lewat environment variable.
// Lokal akan fallback ke 3000.
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());


// ===============================
// HOME / HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
    res.status(200).send("Server Kejuu hidup 🔥");
});


// ===============================
// TEST DATABASE
// ===============================

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.status(200).json({
            success: true,
            database_time: result.rows[0].now
        });

    } catch (error) {
        console.error("Database error:", error);

        res.status(500).json({
            success: false,
            message: "Database gagal terhubung"
        });
    }
});


// ===============================
// GET USERS
// ===============================

app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM users ORDER BY id DESC"
        );

        res.status(200).json({
            success: true,
            users: result.rows
        });

    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            success: false,
            message: "Gagal mengambil users"
        });
    }
});


// ===============================
// CREATE USER
// ===============================

app.post("/api/users", async (req, res) => {
    try {
        const { username } = req.body;

        if (!username || typeof username !== "string") {
            return res.status(400).json({
                success: false,
                message: "Username wajib diisi"
            });
        }

        const result = await pool.query(
            "INSERT INTO users (username) VALUES ($1) RETURNING *",
            [username]
        );

        res.status(201).json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Create user error:", error);

        res.status(500).json({
            success: false,
            message: "Gagal membuat user"
        });
    }
});


// ===============================
// START SERVER
// ===============================

// 0.0.0.0 penting agar Railway dapat
// mengakses server dari luar container.
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Kejuu berjalan di port ${PORT}`);
});
