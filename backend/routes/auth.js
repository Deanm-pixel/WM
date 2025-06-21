const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Registrierung
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Alle Felder sind erforderlich' });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: 'Benutzer existiert bereits' });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    passwordHash,
    role: role || 'user'
  });

  try {
    await user.save();
    res.status(201).json({ message: 'Benutzer erstellt' });
  } catch {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email und Passwort sind erforderlich' });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: 'Benutzer nicht gefunden' });

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid)
    return res.status(400).json({ message: 'Falsches Passwort' });

  const token = jwt.sign(
    { _id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user: { _id: user._id, role: user.role, name: user.name, email: user.email } });
});

module.exports = router;
