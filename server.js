// ─────────────────────────────────────────────
//  server.js  –  School Management API Entry Point
// ─────────────────────────────────────────────

// 1. Load environment variables FIRST (before anything else)
require("dotenv").config();

// 2. Core dependencies
const express = require("express");
const cors    = require("cors");

// 3. Route files
const schoolRoutes = require("./routes/schoolRoutes");

// ── App setup ───────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;

// ── Global Middleware ────────────────────────
app.use(cors());              // Enable Cross-Origin Resource Sharing
app.use(express.json());      // Parse incoming JSON request bodies

// ── Default / Health-check Route ────────────
app.get("/", (req, res) => {
  res.send("School Management API is running...");
});

// ── Mount School Routes ──────────────────────
// All routes defined in schoolRoutes.js will be
// accessible under the /api prefix (e.g. /api/addSchool)
app.use("/api", schoolRoutes);

// ── Start Server ─────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Server is running on http://localhost:${PORT}`);
});
