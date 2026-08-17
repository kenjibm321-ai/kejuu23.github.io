const express = require("express");
const crypto = require("crypto");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// =====================================================
// CORS
// =====================================================

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});


// =====================================================
// PASSWORD HASH
// =====================================================

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");

    const hash = crypto
        .scryptSync(password, salt, 64)
        .toString("hex");

    return `${salt}:${hash}`;
}


function verifyPassword(password, storedHash) {
    try {
        const [salt, originalHash] = storedHash.split(":");

        const hash = crypto
            .scryptSync(password, salt, 64)
            .toString("hex");

        return crypto.timingSafeEqual(
            Buffer.from(hash, "hex"),
            Buffer.from(originalHash, "hex")
        );
    } catch {
        return false;
    }
}


// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
    res.status(200).send("Server Kejuu hidup 🔥");
});


// =====================================================
// TEST DATABASE
// =====================================================

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.status(200).json({
            success: true,
            database_time: result.rows[0].now
        });

    } catch (error) {
        console.error("DATABASE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Database gagal terhubung",
            error: error.message
        });
    }
});


// =====================================================
// GET ALL USERS
// =====================================================

app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                username,
                email,
                created_at,
                updated_at
            FROM users
            ORDER BY id DESC
        `);

        res.status(200).json({
            success: true,
            users: result.rows
        });

    } catch (error) {
        console.error("GET USERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Gagal mengambil users",
            error: error.message
        });
    }
});


// =====================================================
// REGISTER
// =====================================================

app.post("/api/auth/register", async (req, res) => {
    const client = await pool.connect();

    try {
        const { username, password } = req.body;

        // -------------------------
        // VALIDATION
        // -------------------------

        if (!username || typeof username !== "string") {
            return res.status(400).json({
                success: false,
                message: "Username wajib diisi"
            });
        }

        if (!password || typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "Password wajib diisi"
            });
        }

        if (username.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: "Username minimal 3 karakter"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password minimal 6 karakter"
            });
        }

        const cleanUsername = username.trim();

        // -------------------------
        // CHECK USERNAME
        // -------------------------

        const existingUser = await client.query(
            "SELECT id FROM users WHERE username = $1",
            [cleanUsername]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Username sudah digunakan"
            });
        }

        // -------------------------
        // HASH PASSWORD
        // -------------------------

        const passwordHash = hashPassword(password);

        // -------------------------
        // TRANSACTION
        // -------------------------

        await client.query("BEGIN");

        // Create user
        const userResult = await client.query(
            `
            INSERT INTO users (
                username,
                password_hash
            )
            VALUES ($1, $2)
            RETURNING id, username, email, created_at
            `,
            [cleanUsername, passwordHash]
        );

        const user = userResult.rows[0];

        // Create profile
        await client.query(
            `
            INSERT INTO profiles (
                user_id,
                display_name,
                bio,
                avatar_url
            )
            VALUES ($1, $2, $3, $4)
            `,
            [
                user.id,
                cleanUsername,
                "",
                ""
            ]
        );

        // Create progress
        await client.query(
            `
            INSERT INTO progress (
                user_id,
                xp,
                level,
                streak
            )
            VALUES ($1, 0, 'N5', 0)
            `,
            [user.id]
        );

        await client.query("COMMIT");

        // -------------------------
        // RESPONSE
        // -------------------------

        res.status(201).json({
            success: true,
            message: "Registrasi berhasil",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error("REGISTER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Gagal melakukan registrasi",
            error: error.message
        });

    } finally {
        client.release();
    }
});


// =====================================================
// LOGIN
// =====================================================

app.post("/api/auth/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username dan password wajib diisi"
            });
        }

        // -------------------------
        // FIND USER
        // -------------------------

        const result = await pool.query(
            `
            SELECT
                id,
                username,
                email,
                password_hash
            FROM users
            WHERE username = $1
            `,
            [username.trim()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Username atau password salah"
            });
        }

        const user = result.rows[0];

        // -------------------------
        // VERIFY PASSWORD
        // -------------------------

        const validPassword = verifyPassword(
            password,
            user.password_hash
        );

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Username atau password salah"
            });
        }

        // -------------------------
        // SUCCESS
        // -------------------------

        res.status(200).json({
            success: true,
            message: "Login berhasil",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Gagal melakukan login",
            error: error.message
        });
    }
});


// =====================================================
// GET USER PROFILE
// =====================================================

app.get("/api/users/:id/profile", async (req, res) => {
    try {
        const userId = req.params.id;

        const result = await pool.query(
            `
            SELECT
                p.id,
                p.user_id,
                p.display_name,
                p.bio,
                p.avatar_url,
                p.created_at,
                p.updated_at,
                u.username,
                u.email
            FROM profiles p
            JOIN users u
                ON u.id = p.user_id
            WHERE p.user_id = $1
            `,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Profile tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            profile: result.rows[0]
        });

    } catch (error) {

        console.error("GET PROFILE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Gagal mengambil profile",
            error: error.message
        });
    }
});


// =====================================================
// UPDATE USER PROFILE
// =====================================================

app.put("/api/users/:id/profile", async (req, res) => {
    try {
        const userId = req.params.id;

        const {
            display_name,
            bio,
            avatar_url
        } = req.body;

        const result = await pool.query(
            `
            UPDATE profiles
            SET
                display_name = COALESCE($1, display_name),
                bio = COALESCE($2, bio),
                avatar_url = COALESCE($3, avatar_url),
                updated_at = NOW()
            WHERE user_id = $4
            RETURNING *
            `,
            [
                display_name,
                bio,
                avatar_url,
                userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Profile tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile berhasil diperbarui",
            profile: result.rows[0]
        });

    } catch (error) {

        console.error("UPDATE PROFILE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Gagal memperbarui profile",
            error: error.message
        });
    }
});


// =====================================================
// GET USER
// =====================================================

app.get("/api/users/:id", async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                id,
                username,
                email,
                created_at,
                updated_at
            FROM users
            WHERE id = $1
            `,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {

        console.error("GET USER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Gagal mengambil user",
            error: error.message
        });
    }
});


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Kejuu berjalan di port ${PORT}`);
});