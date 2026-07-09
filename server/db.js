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
      `);
        console.log('Database connected and tables initialized');
    } catch (err) {
        console.error('Database error:', err.message);
        throw err;
    }
}