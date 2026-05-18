// ─────────────────────────────────────────────────────────────────
//  controllers/schoolController.js  –  School Business Logic
// ─────────────────────────────────────────────────────────────────
//
//  This file contains the actual logic for each API endpoint.
//  Routes simply call these functions; keeping logic here makes
//  the code easier to read, test, and maintain.
//
//  Endpoints:
//    • addSchool   → POST /api/addSchool
//    • listSchools → GET  /api/listSchools
// ─────────────────────────────────────────────────────────────────

// Database connection pool (mysql2/promise – supports async/await)
const pool = require("../config/db");

// Utility to compute straight-line distance between two coordinates
const { calculateDistance } = require("../utils/distance");


// ══════════════════════════════════════════════════════════════════
//  1. addSchool  –  POST /api/addSchool
// ══════════════════════════════════════════════════════════════════
/**
 * addSchool
 * ---------
 * Validates the request body, then inserts a new school record
 * into the `schools` table.
 *
 * Request body (JSON):
 *   { name, address, latitude, longitude }
 *
 * Success  → 201  { success: true, message: "School added successfully" }
 * Failure  → 400  { success: false, message: "<validation error>" }
 * Server   → 500  { success: false, message: "Internal server error" }
 */
const addSchool = async (req, res) => {
  try {
    // ── Step 1: Extract fields from the request body ──────────────
    const { name, address, latitude, longitude } = req.body;

    // ── Step 2: Presence check – all four fields are required ─────
    if (!name || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, address, latitude, longitude",
      });
    }

    // ── Step 3: Type conversion ───────────────────────────────────
    // Query parameters and some JSON bodies may arrive as strings,
    // so we parse them to numbers before the range checks.
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // ── Step 4: Numeric validation ────────────────────────────────
    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude must be valid numbers",
      });
    }

    // ── Step 5: Range validation ──────────────────────────────────
    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        success: false,
        message: "Latitude must be between -90 and 90",
      });
    }

    if (lon < -180 || lon > 180) {
      return res.status(400).json({
        success: false,
        message: "Longitude must be between -180 and 180",
      });
    }

    // ── Step 6: String field validation ──────────────────────────
    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Name must be a non-empty string",
      });
    }

    if (typeof address !== "string" || address.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Address must be a non-empty string",
      });
    }

    // ── Step 7: Insert into database ──────────────────────────────
    // pool.execute() is used instead of pool.query() because it
    // uses prepared statements, which protect against SQL injection.
    const sql = `
      INSERT INTO schools (name, address, latitude, longitude)
      VALUES (?, ?, ?, ?)
    `;

    await pool.execute(sql, [name.trim(), address.trim(), lat, lon]);

    // ── Step 8: Send success response ────────────────────────────
    return res.status(201).json({
      success: true,
      message: "School added successfully",
    });

  } catch (error) {
    // Log the full error server-side for debugging
    console.error("❌  addSchool error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};


// ══════════════════════════════════════════════════════════════════
//  2. listSchools  –  GET /api/listSchools
// ══════════════════════════════════════════════════════════════════
/**
 * listSchools
 * -----------
 * Fetches every school from the database, calculates how far each
 * one is from the caller's coordinates, and returns them sorted
 * from nearest to farthest.
 *
 * Query parameters:
 *   ?latitude=<number>&longitude=<number>
 *
 * Success  → 200  { success: true, count: N, data: [...schools with distance] }
 * Failure  → 400  { success: false, message: "<validation error>" }
 * Server   → 500  { success: false, message: "Internal server error" }
 */
const listSchools = async (req, res) => {
  try {
    // ── Step 1: Extract query parameters ─────────────────────────
    const { latitude, longitude } = req.query;

    // ── Step 2: Presence check ────────────────────────────────────
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Both latitude and longitude query parameters are required",
      });
    }

    // ── Step 3: Type conversion ───────────────────────────────────
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    // ── Step 4: Numeric validation ────────────────────────────────
    if (isNaN(userLat) || isNaN(userLon)) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude must be valid numbers",
      });
    }

    // ── Step 5: Range validation ──────────────────────────────────
    if (userLat < -90 || userLat > 90) {
      return res.status(400).json({
        success: false,
        message: "Latitude must be between -90 and 90",
      });
    }

    if (userLon < -180 || userLon > 180) {
      return res.status(400).json({
        success: false,
        message: "Longitude must be between -180 and 180",
      });
    }

    // ── Step 6: Fetch all schools from the database ───────────────
    // pool.execute() returns [rows, fields]; we only need rows.
    const [schools] = await pool.execute("SELECT * FROM schools");

    // ── Step 7: Add a distance field to every school ──────────────
    // calculateDistance() returns the distance in kilometres (km).
    const schoolsWithDistance = schools.map((school) => ({
      ...school,
      distance: calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      ),
    }));

    // ── Step 8: Sort from nearest → farthest ─────────────────────
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    // ── Step 9: Send success response ────────────────────────────
    return res.status(200).json({
      success: true,
      count: schoolsWithDistance.length,
      data: schoolsWithDistance,
    });

  } catch (error) {
    // Log the full error server-side for debugging
    console.error("❌  listSchools error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};


// ── Export both controllers ───────────────────────────────────────
// schoolRoutes.js will import these to attach them to their routes.
module.exports = { addSchool, listSchools };
