import pkg from "pg";
const { Pool } = pkg;


export const pool = new Pool({
    host: "localhost",
    port: "5432",
    user: "postgres",
    password: "1234",
    database: "mydb",
})

export async function inDb() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      description TEXT NOT NULL,
      price NUMERIC,
      quantity INT NOT NULL
    );
  `);
}

inDb();