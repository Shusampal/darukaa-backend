const turfArea = require("@turf/area").default || require("@turf/area");

const DEFAULT_CARBON_PER_SQKM = Number(process.env.CARBON_PER_SQKM) || 200;

function computeAreaSqMeters(geojson) {
  try {
    const area = turfArea(geojson);
    return area;
  } catch (error) {
    console.error("Area calculation error:", error);
    throw new Error("Invalid polygon geometry");
  }
}

function estimateCarbon(areaSqMeters, vegetationType = "forest") {
  const areaKm2 = areaSqMeters / 1_000_000;
  const carbonSequestration = areaKm2 * DEFAULT_CARBON_PER_SQKM;

  return Math.max(0, carbonSequestration);
}

module.exports = { computeAreaSqMeters, estimateCarbon };
