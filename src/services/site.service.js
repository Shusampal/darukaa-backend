const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const carbon = require("./carbon.service");

async function createSite(
  ownerId,
  projectId,
  { name, geometry, vegetationType }
) {
  const areaSqMeters = carbon.computeAreaSqMeters(geometry);
  const carbonEstimate = carbon.estimateCarbon(areaSqMeters);
  return prisma.site.create({
    data: {
      name,
      projectId: Number(projectId),
      geometry,
      vegetationType,
      areaSqMeters,
      carbonEstimate,
    },
  });
}

async function getSitesByProject(projectId) {
  return prisma.site.findMany({ where: { projectId: Number(projectId) } });
}

async function getAllSites() {
  return prisma.site.findMany({});
}

module.exports = { createSite, getSitesByProject, getAllSites };
