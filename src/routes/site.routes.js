const router = require("express").Router();
const { requireAuth } = require("../middleware/auth.middleware");
const {
  createSite,
  listSites,
  allSites,
} = require("../controllers/site.controller");

router.use(requireAuth);
router.get("/", allSites);
router.get("/project/:projectId", listSites);
router.post("/project/:projectId", createSite);

module.exports = router;
