import pkg from "pg";
const { Pool } = pkg;


export const pool = new Pool({
    host: process.env.dbhost || 'db',   // default to 'db' (docker-compose service name)
    port: process.env.dbport || "5432",
    user: process.env.dbuser || "postgres",
    password: process.env.dbpass || "1234",
    database: process.env.dbname || "mydb",
})

export async function inDb() {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS items (
          id SERIAL PRIMARY KEY,
          description TEXT NOT NULL,
          price NUMERIC,
          quantity INT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          item int REFERENCES Items(id)
        );

        -- basic account fields (added onto the existing users table)
        ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;  -- scrypt hash, never plaintext
        ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;

        -- session / system event log
        CREATE TABLE IF NOT EXISTS logs (
          id SERIAL PRIMARY KEY,
          level TEXT NOT NULL DEFAULT 'info',
          message TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);
        console.log('Database connected and tables initialized');
    } catch (err) {
        console.error('Database error:', err.message);
        throw err;
    }
}