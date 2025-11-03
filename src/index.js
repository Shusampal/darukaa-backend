require("dotenv").config();
const app = require("./app");
const logger = require("./config/logger");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
