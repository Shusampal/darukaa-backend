const router = require("express").Router();
const { requireAuth } = require("../middleware/auth.middleware");
const {
  createProject,
  listProjects,
  getProject,
} = require("../controllers/project.controller");

router.use(requireAuth);
router.post("/", createProject);
router.get("/", listProjects);
router.get("/:projectId", getProject);

module.exports = router;
