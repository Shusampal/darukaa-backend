const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// More realistic carbon analytics based on vegetation types and seasonal patterns
async function getSiteAnalytics(req, res, next) {
  try {
    const { siteId } = req.params;

    const site = await prisma.site.findUnique({
      where: { id: Number(siteId) },
      select: {
        carbonEstimate: true,
        createdAt: true,
        areaSqMeters: true,
        vegetationType: true,
        name: true,
      },
    });

    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }

    // Realistic carbon sequestration patterns based on vegetation type
    const sequestrationPatterns = {
      forest: {
        growthRate: 0.12, // 12% monthly growth initially
        maturityMonths: 18,
        seasonalVariation: 0.15,
      },
      grassland: {
        growthRate: 0.08,
        maturityMonths: 12,
        seasonalVariation: 0.2,
      },
      wetland: {
        growthRate: 0.1,
        maturityMonths: 15,
        seasonalVariation: 0.1,
      },
      plantation: {
        growthRate: 0.15,
        maturityMonths: 10,
        seasonalVariation: 0.05,
      },
    };

    const pattern =
      sequestrationPatterns[site.vegetationType] ||
      sequestrationPatterns.forest;

    const data = [];
    const siteCreation = new Date(site.createdAt);
    const now = new Date();

    let currentDate = new Date(siteCreation);
    let accumulatedCarbon = 0;

    while (currentDate <= now && data.length < 36) {
      // Max 3 years of data
      const monthsSinceCreation =
        (currentDate - siteCreation) / (30 * 24 * 60 * 60 * 1000);

      // Realistic growth curve - fast initial growth, slowing at maturity
      const progress = Math.min(
        1,
        monthsSinceCreation / pattern.maturityMonths
      );
      const growthFactor = Math.sin((progress * Math.PI) / 2); // S-curve growth

      // Seasonal variation based on month
      const month = currentDate.getMonth();
      const seasonalEffect =
        1 + pattern.seasonalVariation * Math.sin((month * Math.PI) / 6);

      const monthlyCarbon =
        (site.carbonEstimate * growthFactor * seasonalEffect) / 12;
      accumulatedCarbon += monthlyCarbon;

      // Ensure we don't exceed total estimate
      const currentCarbon = Math.min(
        accumulatedCarbon,
        site.carbonEstimate * 0.95
      );

      data.push({
        date: new Date(currentDate).toISOString(),
        value: Math.round(currentCarbon * 100) / 100,
        progress: `${Math.round(progress * 100)}%`,
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // If brand new site with no data yet
    if (data.length === 0) {
      data.push({
        date: siteCreation.toISOString(),
        value: 0,
        progress: "0%",
      });
    }

    res.json({
      siteId: Number(siteId),
      siteName: site.name,
      metric: "carbon_sequestration_tons",
      summary: {
        finalEstimate: site.carbonEstimate,
        currentEstimate: data.length > 0 ? data[data.length - 1].value : 0,
        areaSqMeters: site.areaSqMeters,
        vegetationType: site.vegetationType,
        dataPoints: data.length,
        progress: data.length > 0 ? data[data.length - 1].progress : "0%",
      },
      series: data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSiteAnalytics };
