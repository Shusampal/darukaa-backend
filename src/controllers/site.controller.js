const siteService = require("../services/site.service");
const { siteCreateSchema } = require("../utils/validators");

async function createSite(req, res, next) {
  try {
    const ownerId = Number(req.user.userId);
    const { projectId } = req.params;

    console.log("Creating site for project:", projectId);
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    // Enhanced validation
    const validationResult = siteCreateSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.log("Validation failed:", validationResult.error.errors);
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validationResult.error.errors,
        message:
          validationResult.error.errors[0]?.message || "Invalid site data",
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
    next(err);
  }
}

async function listSites(req, res, next) {
  try {
    const { projectId } = req.params;
    const sites = await siteService.getSitesByProject(projectId);
    res.json({
      success: true,
      sites: sites || [], // Ensure always an array
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
      sites: sites || [], // Ensure always an array
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createSite, listSites, allSites };
