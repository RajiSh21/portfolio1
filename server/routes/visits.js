const express = require('express');
const Visit = require('../models/Visit');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/visits/track  (public - called on every page load)
router.post('/track', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
    const visit = await Visit.create({
      page: req.body.page || '/',
      userAgent: req.headers['user-agent'] || '',
      ip,
      referrer: req.body.referrer || req.headers.referer || '',
    });
    res.status(201).json({ id: visit._id });
  } catch (err) {
    // Don't crash on tracking errors
    res.status(500).json({ message: err.message });
  }
});

// GET /api/visits/stats  (protected - admin only)
router.get('/stats', protect, async (req, res) => {
  try {
    const totalVisits = await Visit.countDocuments();

    // Today
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const todayVisits = await Visit.countDocuments({ timestamp: { $gte: startOfDay } });

    // Last 7 days daily breakdown
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyData = await Visit.aggregate([
      { $match: { timestamp: { $gte: sevenDaysAgo } } },
      { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 },
        }
      },
      { $sort: { _id: 1 } },
    ]);

    // Last 10 recent visits
    const recentVisits = await Visit.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .select('page ip referrer timestamp userAgent');

    // Page breakdown
    const pageBreakdown = await Visit.aggregate([
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({ totalVisits, todayVisits, dailyData, recentVisits, pageBreakdown });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
