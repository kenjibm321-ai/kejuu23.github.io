const express = require("express");
const pool = require("./db");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());


// =========================
// HOME
// =========================

app.get("/", (req, res) => {
    res.send("Server Kejuu hidup 🔥");
});


// =========================
// TEST DATABASE
// =========================

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            success: true,
            database_time: result.rows[0].now
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database gagal terhubung"
        });
    }
});


// =========================
// CREATE USER
// =========================

app.post("/api/users", async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
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
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Gagal membuat user"
        });
    }
});


// =========================
// GET USERS
// =========================

app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM users ORDER BY id DESC"
        );

        res.json({
            success: true,
            users: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Gagal mengambil users"
        });
    }
});


// =========================
// SERVER
// =========================

app.listen(PORT, () => {
    console.log(`Server Kejuu berjalan di http://localhost:${PORT}`);
});
