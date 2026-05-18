// ─────────────────────────────────────────────
//  config/db.js  –  MySQL Database Connection
// ─────────────────────────────────────────────

// Step 1: Load environment variables from .env
//         (must be called before reading process.env)
require("dotenv").config();

// Step 2: Import mysql2 with built-in Promise support
//         Using mysql2/promise means every query returns a Promise,
//         so we can use async/await without any extra wrapper.
const mysql = require("mysql2/promise");

// ── Step 3: Create a Connection Pool ────────────────────────────────────────
//
// WHY a pool instead of a single connection?
//   • A single connection handles ONE query at a time.
//   • A pool manages MULTIPLE connections simultaneously,
//     making the API much faster under real-world traffic.
//
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  ssl: {
    rejectUnauthorized: false,
  },
});

// ── Step 4: Test the connection on startup ───────────────────────────────────
//
// We borrow one connection from the pool, run a lightweight query (SELECT 1),
// then immediately release it back. This confirms MySQL is reachable when
// the server boots, rather than discovering a bad password on the first API call.
//
const testConnection = async () => {
  try {
    const connection = await pool.getConnection(); // borrow a connection
    await connection.query("SELECT 1");            // lightest possible query
    connection.release();                          // return it to the pool

    console.log("✅  Database connected successfully");
  } catch (error) {
    console.error("❌  Database connection failed:", error.message);
    console.error("    Check your .env credentials (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)");
    process.exit(1); // stop the server – no point running without a DB
  }
};

// Run the test immediately when this file is first loaded
testConnection();

// ── Step 5: Export the pool ──────────────────────────────────────────────────
//
// Every controller will require("../config/db") and call
// pool.execute(sql, [params]) with async/await.
//
module.exports = pool;
