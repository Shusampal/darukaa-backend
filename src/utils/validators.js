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
  geometry: geoJSONSchema.refine((geo) => {
    // Validate area limits (min 1000 sqm, max 100 sqkm)
    const turfArea = require("@turf/area").default || require("@turf/area");
    const area = turfArea(geo);
    return area >= 1000 && area <= 100000000; // 1000 sqm to 100 sqkm
  }, "Site area must be between 1,000 sqm and 100 sqkm"),
});

module.exports = {
  registerSchema,
  loginSchema,
  siteCreateSchema,
  geoJSONSchema,
};
