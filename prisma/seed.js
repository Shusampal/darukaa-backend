require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- 1️⃣ Users ---
  const user1 = await prisma.user.upsert({
    where: { email: "alice@darukaa.earth" },
    update: {},
    create: {
      name: "Alice Green",
      email: "alice@darukaa.earth",
      password: "123", // password123
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "bob@darukaa.earth" },
    update: {},
    create: {
      name: "Bob Forest",
      email: "bob@darukaa.earth",
      password: "123",
    },
  });

  // --- 2️⃣ Projects ---
  const project1 = await prisma.project.create({
    data: {
      name: "Amazon Reforestation",
      description: "Restoring native forest in the Amazon basin.",
      ownerId: user1.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Savannah Grassland Revival",
      description: "Grassland carbon restoration in East Africa.",
      ownerId: user2.id,
    },
  });

  // --- 3️⃣ Example Sites ---
  const exampleSites = [
    {
      name: "Rainforest Zone A",
      vegetationType: "forest",
      projectId: project1.id,
      geometry: {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-60.025, -3.107],
              [-60.022, -3.107],
              [-60.022, -3.103],
              [-60.025, -3.103],
              [-60.025, -3.107],
            ],
          ],
        },
      },
    },
    {
      name: "Grassland Patch 1",
      vegetationType: "grassland",
      projectId: project2.id,
      geometry: {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [34.85, -1.45],
              [34.86, -1.45],
              [34.86, -1.44],
              [34.85, -1.44],
              [34.85, -1.45],
            ],
          ],
        },
      },
    },
  ];

  for (const site of exampleSites) {
    const areaSqMeters = Math.random() * 100000 + 2000;
    const carbonEstimate = Math.random() * 500 + 100;
    await prisma.site.create({
      data: {
        ...site,
        areaSqMeters,
        carbonEstimate,
      },
    });
  }

  console.log("✅ Seed data created successfully!");
}

// Export for use in index.js
module.exports = { main };

// Allow manual seeding with `npm run seed`
if (require.main === module) {
  main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e);
      prisma.$disconnect();
    });
}
