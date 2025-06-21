const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: 'Kein Token gefunden' });

  const token = authHeader.split(' ')[1];
  if (!token)
    return res.status(401).json({ message: 'Kein Token gefunden' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { _id, role, name, email }
    next();
  } catch {
    return res.status(401).json({ message: 'Ungültiges Token' });
  }
}

module.exports = authMiddleware;
