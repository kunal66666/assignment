

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Kudos = require('../models/Kudos');

router.get('/', async (req, res) => {
  try {
    const kudos = await Kudos.find({})
      .populate('from', 'name email')
      .populate('to', 'name email')
      .sort({ timestamp: -1 });
    
    const kudosWithLikes = kudos.map(kudo => ({
      ...kudo.toObject(),
      likeCount: Array.from(kudo.likes.values()).filter(Boolean).length,
      likedByCurrentUser: !!kudo.likes.get(req.query.userId) // pass current user ID in query
    }));

    res.json(kudosWithLikes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const kudo = await Kudos.findById(req.params.id);

    if (!kudo) {
      return res.status(404).json({ error: 'Kudo not found' });
    }

    const isLiked = kudo.likes.get(userId);
    kudo.likes.set(userId, !isLiked);

    await kudo.save();
    res.json({ success: true, likes: Array.from(kudo.likes.values()).filter(Boolean).length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { from, to, message, category } = req.body;
    
    const [fromUser, toUser] = await Promise.all([
      User.findById(from),
      User.findById(to)
    ]);
    
    if (!fromUser || !toUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const kudos = new Kudos({ from, to, message, category });
    await kudos.save();

    fromUser.kudosGiven.push(kudos._id);
    toUser.kudosReceived.push(kudos._id);
    
    await Promise.all([
      fromUser.save(),
      toUser.save()
    ]);

    res.status(201).json(kudos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const kudos = await Kudos.find({})
      .populate('from', 'name email')
      .populate('to', 'name email')
      .sort({ timestamp: -1 });
    res.json(kudos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
