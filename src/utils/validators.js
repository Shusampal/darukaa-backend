const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Enhanced GeoJSON validation schema
const geoJSONSchema = z.object({
  type: z.literal("Feature"),
  geometry: z.object({
    type: z.literal("Polygon"),
    coordinates: z.array(z.array(z.array(z.number()))).refine((coords) => {
      // Validate polygon has at least 4 points (closed ring)
      return coords[0] && coords[0].length >= 4;
    }, "Polygon must have at least 4 points"),
  }),
  properties: z.object({}).optional(),
});

const siteCreateSchema = z.object({
  name: z.string().min(1).max(100),
  vegetationType: z.enum(["forest", "grassland", "wetland", "plantation"]),
  geometry: geoJSONSchema.refine(
    (geo) => {
      try {
        // Validate area limits - only minimum restriction
        const turfArea = require("@turf/area").default || require("@turf/area");
        const area = turfArea(geo);

        console.log("Calculated area:", area, "sq meters");

        // Only check minimum area - remove maximum restriction
        if (area < 1000) {
          return false; // Area too small (minimum 1,000 sqm)
        }

        // Warn about very large areas but don't block them
        if (area > 10000000000) {
          // 10,000 sqkm - just for logging
          console.warn("Very large area detected:", area / 1000000, "sq km");
        }

        return true;
      } catch (error) {
        console.error("Area calculation error:", error);
        return false;
      }
    },
    {
      message:
        "Site area must be at least 1,000 sqm. Please draw a larger polygon.",
    }
  ),
});

module.exports = {
  registerSchema,
  loginSchema,
  siteCreateSchema,
  geoJSONSchema,
};
