const router = require("express").Router();
const { requireAuth } = require("../middleware/auth.middleware");
const { getSiteAnalytics } = require("../controllers/analytics.controller");

router.use(requireAuth);
router.get("/site/:siteId", getSiteAnalytics);

module.exports = router;
