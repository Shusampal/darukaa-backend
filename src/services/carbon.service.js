const turfArea = require("@turf/area").default || require("@turf/area");

const DEFAULT_CARBON_PER_SQKM = Number(process.env.CARBON_PER_SQKM) || 200;

function computeAreaSqMeters(geojson) {
  try {
    const area = turfArea(geojson);
    console.log(`Calculated area: ${area.toLocaleString()} sqm`);
    return area;
  } catch (error) {
    console.error("Area calculation error:", error);
    throw new Error("Invalid polygon geometry");
  }
}

function estimateCarbon(areaSqMeters, vegetationType = "forest") {
  const areaKm2 = areaSqMeters / 1_000_000;
  const carbonSequestration = areaKm2 * DEFAULT_CARBON_PER_SQKM;

  console.log(
    `Carbon estimate: ${areaKm2.toFixed(2)} km² × ${DEFAULT_CARBON_PER_SQKM} = ${carbonSequestration.toFixed(2)} tons/year`
  );

  return Math.max(0, carbonSequestration);
}

module.exports = { computeAreaSqMeters, estimateCarbon };
