const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { errorHandler } = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const siteRoutes = require("./routes/site.routes");
const analyticsRoutes = require("./routes/analytics.routes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/sites", siteRoutes);
app.use("/api/analytics", analyticsRoutes);

// health
app.get("/health", (req, res) =>
  res.status(200).json({ success: true, message: "I am working fine" })
);

app.use(errorHandler);

module.exports = app;
