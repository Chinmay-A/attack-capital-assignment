const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const DB_NAME = process.env.POSTGRES_DB;
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const DB_HOST = process.env.POSTGRES_HOST;
const DB_USER = process.env.POSTGRES_USER;
const DB_PORT = process.env.POSTGRES_PORT;

const DB_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
const pool = new Pool({ connectionString: DB_URL });

const createTables = async () => {
    const client = await pool.connect();
    try {
        console.log("Creating tables...");

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                author_email TEXT NOT NULL REFERENCES users(email) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Tables created successfully ✅");
    } catch (error) {
        console.error("Error creating tables ❌", error);
    } finally {
        client.release();
        pool.end();
    }
};

createTables();
