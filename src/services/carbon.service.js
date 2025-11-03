const turfArea = require("@turf/area").default || require("@turf/area");

const DEFAULT_CARBON_PER_SQKM = Number(process.env.CARBON_PER_SQKM) || 200;

function computeAreaSqMeters(geojson) {
  try {
    const area = turfArea(geojson);

    // CRITICAL: Validate realistic area sizes
    const areaSqKm = area / 1_000_000;

    if (areaSqKm < 0.001) {
      // 1,000 sqm minimum
      throw new Error("Area too small (minimum 1,000 sqm required)");
    }

    if (areaSqKm > 10000) {
      // 10,000 sqkm maximum
      throw new Error("Area too large (maximum 10,000 sq km allowed)");
    }

    console.log(
      `Calculated area: ${area.toLocaleString()} sqm (${areaSqKm.toFixed(2)} sq km)`
    );
    return area;
  } catch (error) {
    console.error("Area calculation error:", error);
    throw new Error(`Invalid site area: ${error.message}`);
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
