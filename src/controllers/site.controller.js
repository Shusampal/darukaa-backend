const siteService = require("../services/site.service");
const { siteCreateSchema } = require("../utils/validators");

async function createSite(req, res, next) {
  try {
    const ownerId = Number(req.user.userId);
    const { projectId } = req.params;

    // Enhanced validation
    const validationResult = siteCreateSchema.safeParse(req.body);
    if (!validationResult.success) {
      // Get the first error message
      const firstError = validationResult.error.errors[0];
      const errorMessage = firstError
        ? firstError.message
        : "Invalid site data";

      return res.status(400).json({
        success: false,
        error: "Validation failed",
        message: errorMessage,
        details: validationResult.error.errors,
      });
    }

    const { name, geometry, vegetationType } = validationResult.data;

    const site = await siteService.createSite(ownerId, projectId, {
      name,
      geometry,
      vegetationType,
    });

    res.status(201).json({
      success: true,
      site,
      message: "Site created successfully",
    });
  } catch (err) {
    console.error("Error in createSite controller:", err);

    // Handle specific service errors
    if (err.message.includes("Site validation failed")) {
      return res.status(400).json({
        success: false,
        error: "Site validation failed",
        message: err.message,
      });
    }

    next(err);
  }
}

async function listSites(req, res, next) {
  try {
    const { projectId } = req.params;
    const sites = await siteService.getSitesByProject(projectId);
    res.json({
      success: true,
      sites: sites || [],
    });
  } catch (err) {
    next(err);
  }
}

async function allSites(req, res, next) {
  try {
    const sites = await siteService.getAllSites();
    res.json({
      success: true,
      sites: sites || [],
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createSite, listSites, allSites };
