const express = require('express');
const Card = require('../models/Card');
const Comment = require('../models/Comment');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Admin-only Statistiken
router.get('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const totalCards = await Card.countDocuments();
    const totalComments = await Comment.countDocuments();

    // Aktive User: z.B. Anzahl User mit mindestens einer Karte oder Kommentar
    const usersWithCards = await Card.distinct('creatorId');
    const usersWithComments = await Comment.distinct('userId');
    const activeUsers = new Set([...usersWithCards, ...usersWithComments]).size;

    res.json({ totalCards, totalComments, activeUsers });
  } catch {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

module.exports = router;
