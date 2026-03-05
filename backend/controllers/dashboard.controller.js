const db=require("../models/db")
exports.getStats = async (req, res) => {
  
  try {
    const totalEvents = await db.query("SELECT COUNT(*) as count FROM events");

    // Queries for the dashboard Doughnut Chart
    const conferences = await db.query("SELECT COUNT(*) as count FROM events WHERE events.event_type='Conference'");
    // console.log(conferences)
    const meetUps = await db.query("SELECT COUNT(*) as count FROM events WHERE events.event_type='Meetup'");
    // console.log(meetUps)
    const workShops = await db.query("SELECT COUNT(*) as count FROM events WHERE events.event_type='Workshop'");
    // console.log(workShops)

    const stats = {
      dashboard: {
        totalEvents: parseInt(totalEvents[0][0].count),
      },
      dashboardChart: {
        conferences: parseInt(conferences[0][0].count),
        meetUps: parseInt(meetUps[0][0].count),
        workShops: parseInt(workShops[0][0].count),
      },
    };
    res.json(stats);
    console.log(stats)

  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};