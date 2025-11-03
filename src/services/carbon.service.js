const turfArea = require("@turf/area").default || require("@turf/area");
/**
 * carbonPerSqKm is configurable; example uses 200 tons per km^2 per year.
 */
const DEFAULT_CARBON_PER_SQKM = Number(process.env.CARBON_PER_SQKM) || 200;

function computeAreaSqMeters(geojson) {
  const area = turfArea(geojson); // returns square meters
  return area;
}

function estimateCarbon(areaSqMeters) {
  const areaKm2 = areaSqMeters / 1_000_000;
  return areaKm2 * DEFAULT_CARBON_PER_SQKM;
}

module.exports = { computeAreaSqMeters, estimateCarbon };
