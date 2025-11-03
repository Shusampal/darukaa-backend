require("dotenv").config();
const app = require("./app");
const logger = require("./config/logger");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const PORT = process.env.PORT || 8080;

async function seedIfEmpty() {
  try {
    const users = await prisma.user.count();
    if (users === 0) {
      logger.info("🌱 No users found — running DB seed...");
      const seed = require("./prisma/seed.js");
      await seed.main(); // call seed.main() directly
      logger.info("✅ Seed data populated successfully.");
    } else {
      logger.info("✅ Database already seeded — skipping.");
    }
  } catch (err) {
    logger.error("❌ Error during seeding:", err);
  }
}

app.listen(PORT, async () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  await seedIfEmpty();
});
