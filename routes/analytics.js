const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Kudos = require('../models/Kudos');

router.get('/overview', async (req, res) => {
  try {
    const [totalUsers, totalKudos] = await Promise.all([
      User.countDocuments(),
      Kudos.countDocuments()
    ]);

    const categoryStats = await Kudos.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const topReceivers = await User.aggregate([
      {
        $project: {
          name: 1,
          kudosCount: { $size: '$kudosReceived' }
        }
      },
      { $sort: { kudosCount: -1 } },
      { $limit: 5 }
    ]);

    // Fixed query to handle null/undefined likes field
    const mostLikedKudos = await Kudos.aggregate([
      {
        $addFields: {
          likeCount: {
            $size: {
              $filter: {
                input: {
                  $cond: {
                    if: { $eq: [{ $type: "$likes" }, "object"] },
                    then: { $objectToArray: "$likes" },
                    else: []
                  }
                },
                as: "like",
                cond: { $eq: ["$$like.v", true] }
              }
            }
          }
        }
      },
      {
        $sort: { likeCount: -1 }
      },
      {
        $limit: 1
      },
      {
        $lookup: {
          from: 'users',
          localField: 'from',
          foreignField: '_id',
          as: 'fromUser'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'to',
          foreignField: '_id',
          as: 'toUser'
        }
      },
      {
        $project: {
          message: 1,
          likeCount: 1,
          'fromUser.name': 1,
          'toUser.name': 1
        }
      }
    ]);

    res.json({
      totalUsers,
      totalKudos,
      categoryStats,
      topReceivers,
      mostLikedKudos: mostLikedKudos[0] || null
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;