const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const carbon = require("./carbon.service");

async function createSite(
  ownerId,
  projectId,
  { name, geometry, vegetationType }
) {
  try {
    // CRITICAL: This will now validate area and throw errors for unrealistic sizes
    const areaSqMeters = carbon.computeAreaSqMeters(geometry);
    const carbonEstimate = carbon.estimateCarbon(areaSqMeters, vegetationType);

    console.log(
      `Creating site: ${areaSqMeters.toLocaleString()} sqm, ${carbonEstimate.toFixed(2)} tons CO₂/year`
    );

    return await prisma.site.create({
      data: {
        name,
        projectId: Number(projectId),
        geometry,
        vegetationType,
        areaSqMeters,
        carbonEstimate,
      },
    });
  } catch (error) {
    console.error("Error creating site:", error);
    throw new Error(`Site validation failed: ${error.message}`);
  }
}

async function getSitesByProject(projectId) {
  return prisma.site.findMany({
    where: { projectId: Number(projectId) },
    orderBy: { createdAt: "desc" },
  });
}

async function getAllSites() {
  return prisma.site.findMany({
    orderBy: { createdAt: "desc" },
  });
}

module.exports = { createSite, getSitesByProject, getAllSites };
