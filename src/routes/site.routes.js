const router = require("express").Router();
const { requireAuth } = require("../middleware/auth.middleware");
const { createSite, listSites } = require("../controllers/site.controller");

router.use(requireAuth);
router.post("/:projectId", createSite);
router.get("/project/:projectId", listSites);

module.exports = router;
