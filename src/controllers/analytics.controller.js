// returns simple mock timeseries for given siteId
async function getSiteAnalytics(req, res, next) {
  try {
    const { siteId } = req.params;
    // generate mock monthly values for last 12 months
    const now = new Date();
    const data = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        date: d.toISOString(),
        value: Math.round(50 + Math.random() * 50),
      });
    }
    res.json({
      siteId: Number(siteId),
      metric: "carbon_capture",
      series: data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSiteAnalytics };
