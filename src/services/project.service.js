const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createProject(ownerId, { name, description }) {
  return prisma.project.create({ data: { name, description, ownerId } });
}

async function listProjects(ownerId, skip = 0, take = 20) {
  return prisma.project.findMany({
    where: { ownerId },
    skip,
    take,
    include: { sites: true },
  });
}

async function getProject(ownerId, projectId) {
  return prisma.project.findUnique({
    where: { ownerId, id: projectId },
  });
}

module.exports = { createProject, listProjects, getProject };
