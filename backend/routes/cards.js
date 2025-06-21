const express = require('express');
const Card = require('../models/Card');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Alle Karten lesen (für alle Rollen)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });
    res.json(cards);
  } catch {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Karte nach ID lesen
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Karte nicht gefunden' });
    res.json(card);
  } catch {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Karte erstellen (Editor + Admin)
router.post('/', authMiddleware, roleMiddleware(['admin', 'editor']), async (req, res) => {
  try {
    const { title, content, expirationDate } = req.body;
    const card = new Card({
      title,
      content,
      expirationDate: expirationDate ? new Date(expirationDate) : null,
      creatorId: req.user._id
    });
    await card.save();
    res.status(201).json(card);
  } catch {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Karte bearbeiten (Admin + Editor + eigener User)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Karte nicht gefunden' });

    // Rechtecheck
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'editor' &&
      card.creatorId.toString() !== req.user._id
    ) {
      return res.status(403).json({ message: 'Keine Berechtigung' });
    }

    const { title, content, expirationDate } = req.body;
    card.title = title || card.title;
    card.content = content || card.content;
    card.expirationDate = expirationDate ? new Date(expirationDate) : null;

    await card.save();
    res.json(card);
  } catch {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Karte löschen (Admin + Editor)
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'editor']), async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Karte nicht gefunden' });

    await card.deleteOne();
    res.json({ message: 'Karte gelöscht' });
  } catch {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

module.exports = router;
