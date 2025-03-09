const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

// Load environment variables
dotenv.config();

const PORT = process.env.APP_PORT || 5000;
const DB_NAME = process.env.POSTGRES_DB;
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const DB_HOST = process.env.POSTGRES_HOST;
const DB_USER = process.env.POSTGRES_USER;
const DB_PORT = process.env.POSTGRES_PORT;
const AUTH_SECRET = process.env.AUTH_SECRET;

const DB_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
const pool = new Pool({ connectionString: DB_URL });

const app = express();
app.use(express.json());
app.use(cors());

function authenticateToken(req, res, next) {
    const token = req.header("Authorization")?.split("Bearer ")[1];

    if (!token) {
        return res.status(401).json({ error: "Could not authenticate" });
    }

    try {
        const decoded = jwt.verify(token, AUTH_SECRET);
        if (!decoded.userEmail) {
            return res.status(401).json({ error: "Invalid token" });
        }

        req.user = { userEmail: decoded.userEmail };
        next();
    } catch (error) {
        res.status(401).json({ error: "Could not be authenticated" });
    }
}

app.post("/api/signup", async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("POST: /signup")

    try {
        const result = await pool.query(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
            [email, hashedPassword]
        );
        res.json({ message: "User registered", userId: result.rows[0].id });
    } catch (error) {
        res.status(400).json({ error: "User already exists" });
    }
});

app.post("/api/login", async (req, res) => {
    console.log("POST: /login")
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0 || !(await bcrypt.compare(password, user.rows[0].password_hash))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userEmail: email }, AUTH_SECRET, { expiresIn: "12h" });
    res.json({ token });
});

app.post("/api/post", authenticateToken, async (req, res) => {
    console.log("POST: /post")
    const { title, content } = req.body;
    const userEmail = req.user.userEmail;

    try {
        const result = await pool.query(
            "INSERT INTO posts (title, content, author_email) VALUES ($1, $2, $3) RETURNING *",
            [title, content, userEmail]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: "Failed to create post" });
    }
});

app.get("/api/posts", async (req, res) => {
    console.log("GET: /posts")
    const { author } = req.query;
    const query = author ? "SELECT * FROM posts WHERE author_email = $1" : "SELECT * FROM posts";
    const values = author ? [author] : [];

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch posts" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
