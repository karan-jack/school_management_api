// ─────────────────────────────────────────────
//  utils/distance.js  –  Distance Calculator
// ─────────────────────────────────────────────

// geolib is already installed (see package.json).
// It provides accurate geo-calculations using the Haversine formula,
// which accounts for the curvature of the Earth.
const geolib = require("geolib");

/**
 * calculateDistance
 * -----------------
 * Returns the straight-line distance (in kilometres) between two
 * geographic points.
 *
 * @param {number} lat1  – Latitude  of point A  (user's location)
 * @param {number} lon1  – Longitude of point A  (user's location)
 * @param {number} lat2  – Latitude  of point B  (school's location)
 * @param {number} lon2  – Longitude of point B  (school's location)
 * @returns {number}       Distance in kilometres, rounded to 2 decimal places
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // getDistance() returns the distance in METRES
  const distanceInMetres = geolib.getDistance(
    { latitude: lat1, longitude: lon1 },  // point A
    { latitude: lat2, longitude: lon2 }   // point B
  );

  // Convert metres → kilometres and round to 2 decimal places
  const distanceInKm = distanceInMetres / 1000;
  return Math.round(distanceInKm * 100) / 100;
};

module.exports = { calculateDistance };
