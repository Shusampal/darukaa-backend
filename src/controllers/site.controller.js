const siteService = require("../services/site.service");
const { siteCreateSchema } = require("../utils/validators");

async function createSite(req, res, next) {
  try {
    const ownerId = Number(req.user.userId);
    const { projectId } = req.params;

    // Enhanced validation
    const validationResult = siteCreateSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
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
    next(err);
  }
}

async function listSites(req, res, next) {
  try {
    const { projectId } = req.params;
    const sites = await siteService.getSitesByProject(projectId);
    res.json({ success: true, sites });
  } catch (err) {
    next(err);
  }
}

async function allSites(req, res, next) {
  try {
    const sites = await siteService.getAllSites();
    res.json({ success: true, sites });
  } catch (err) {
    next(err);
  }
}

module.exports = { createSite, listSites, allSites };
