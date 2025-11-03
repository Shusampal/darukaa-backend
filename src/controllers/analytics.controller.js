const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// returns realistic timeseries based on site creation and carbon estimates
async function getSiteAnalytics(req, res, next) {
  try {
    const { siteId } = req.params;

    // Get site data including creation date and carbon estimate
    const site = await prisma.site.findUnique({
      where: { id: Number(siteId) },
      select: {
        carbonEstimate: true,
        createdAt: true,
        areaSqMeters: true,
        vegetationType: true,
      },
    });

    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }

    // Generate realistic growth data based on site characteristics
    const growthRates = {
      forest: 0.08, // 8% monthly growth
      grassland: 0.05, // 5% monthly growth
      wetland: 0.06, // 6% monthly growth
      plantation: 0.1, // 10% monthly growth (managed growth)
    };

    const growthRate = growthRates[site.vegetationType] || 0.07;
    const baseCarbon = site.carbonEstimate * 0.1; // Start at 10% of final estimate

    // Generate monthly values from site creation to now
    const now = new Date();
    const siteCreation = new Date(site.createdAt);
    const data = [];

    let currentDate = new Date(siteCreation);
    let currentCarbon = baseCarbon;

    while (currentDate <= now && data.length < 24) {
      // Max 2 years of data
      // Add some realistic variation (±15%)
      const variation = 0.85 + Math.random() * 0.3;
      const monthlyCarbon = currentCarbon * variation;

      data.push({
        date: new Date(currentDate).toISOString(),
        value: Math.max(0, Math.round(monthlyCarbon * 100) / 100), // Ensure non-negative
      });

      // Grow carbon estimate for next month
      currentCarbon *= 1 + growthRate;

      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // If no data (brand new site), create initial point
    if (data.length === 0) {
      data.push({
        date: siteCreation.toISOString(),
        value: Math.round(baseCarbon * 100) / 100,
      });
    }

    res.json({
      siteId: Number(siteId),
      metric: "carbon_capture_tons",
      summary: {
        currentEstimate: site.carbonEstimate,
        areaSqMeters: site.areaSqMeters,
        vegetationType: site.vegetationType,
        dataPoints: data.length,
      },
      series: data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSiteAnalytics };
