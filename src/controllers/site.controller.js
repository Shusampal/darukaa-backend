const siteService = require("../services/site.service");

async function createSite(req, res, next) {
  try {
    const ownerId = Number(req.user.userId);
    const { projectId } = req.params;
    const { name, geometry } = req.body;
    // basic validation
    if (!name || !geometry)
      return res.status(400).json({ error: "Missing name or geometry" });
    const site = await siteService.createSite(ownerId, projectId, {
      name,
      geometry,
    });
    res.status(201).json(site);
  } catch (err) {
    next(err);
  }
}

async function listSites(req, res, next) {
  try {
    const { projectId } = req.params;
    const sites = await siteService.getSitesByProject(projectId);
    res.json(sites);
  } catch (err) {
    next(err);
  }
}

async function allSites(req, res, next) {
  try {
    const { projectId } = req.params;
    const sites = await siteService.getAllSites();
    res.json(sites);
  } catch (err) {
    next(err);
  }
}

module.exports = { createSite, listSites, allSites };
