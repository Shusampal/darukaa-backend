const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const carbon = require("./carbon.service");

async function createSite(ownerId, projectId, { name, geometry }) {
  // geometry expected GeoJSON (Polygon)
  const areaSqMeters = carbon.computeAreaSqMeters(geometry);
  const carbonEstimate = carbon.estimateCarbon(areaSqMeters);
  const site = await prisma.site.create({
    data: {
      name,
      projectId: Number(projectId),
      geometry,
      areaSqMeters,
      carbonEstimate,
    },
  });
  return site;
}

async function getSitesByProject(projectId) {
  return prisma.site.findMany({ where: { projectId: Number(projectId) } });
}

module.exports = { createSite, getSitesByProject };
