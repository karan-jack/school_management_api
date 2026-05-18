// -----------------------------------------------------------------
//  routes/schoolRoutes.js  –  School API Route Definitions
// -----------------------------------------------------------------
//
//  This file only defines WHICH URL maps to WHICH controller.
//  All the actual logic lives in controllers/schoolController.js.
//
//  Routes exposed (mounted under /api in server.js):
//    POST /api/addSchool
//    GET  /api/listSchools
// -----------------------------------------------------------------

// Step 1: Create an Express Router instance
const express = require("express");
const router  = express.Router();

// Step 2: Import the controller functions
const { addSchool, listSchools } = require("../controllers/schoolController");


// -- Route Definitions ---------------------------------------------

// POST /api/addSchool
// Accepts JSON body: { name, address, latitude, longitude }
router.post("/addSchool", addSchool);

// GET /api/listSchools
// Accepts query params: ?latitude=<number>&longitude=<number>
router.get("/listSchools", listSchools);


// Step 3: Export the router so server.js can mount it
module.exports = router;
