const express = require('express');
const Comment = require('../models/Comment');
const Card = require('../models/Card');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { notifyCardOwnerNewComment } = require('../utils/notifications');

const router = express.Router();

// Kommentare zu einer Karte holen
router.get('/:cardId', authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.find({ cardId: req.params.cardId }).sort({ createdAt: 1 });
    res.json(comments);
  } catch {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Kommentar hinzufügen
router.post('/:cardId', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text erforderlich' });

    const card = await Card.findById(req.params.cardId);
    if (!card) return res.status(404).json({ message: 'Karte nicht gefunden' });

    const comment = new Comment({
      cardId: req.params.cardId,
      userId: req.user._id,
      userName: req.user.name,
      text
    });

    await comment.save();

    // Benachrichtigung an Kartenbesitzer
    notifyCardOwnerNewComment(card.creatorId, comment);

    res.status(201).json(comment);
  } catch {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Kommentar bearbeiten (nur eigener Kommentar oder Admin/Editor)
router.put('/:commentId', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Kommentar nicht gefunden' });

    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'editor' &&
      comment.userId.toString() !== req.user._id
    ) {
      return res.status(403).json({ message: 'Keine Berechtigung' });
    }

    comment.text = req.body.text || comment.text;
    await comment.save();
    res.json(comment);
  } catch {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Kommentar löschen (Admin + Editor + eigener User)
router.delete('/:commentId', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Kommentar nicht gefunden' });

    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'editor' &&
      comment.userId.toString() !== req.user._id
    ) {
      return res.status(403).json({ message: 'Keine Berechtigung' });
    }

    await comment.deleteOne();
    res.json({ message: 'Kommentar gelöscht' });
  } catch {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

module.exports = router;
