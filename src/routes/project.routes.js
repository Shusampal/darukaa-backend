const router = require("express").Router();
const { requireAuth } = require("../middleware/auth.middleware");
const {
  createProject,
  listProjects,
} = require("../controllers/project.controller");

router.use(requireAuth);
router.post("/", createProject);
router.get("/", listProjects);

module.exports = router;
