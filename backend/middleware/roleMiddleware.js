function roleMiddleware(roles = []) {
  if (typeof roles === 'string') roles = [roles];

  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Nicht authentifiziert' });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: 'Keine Berechtigung' });
    next();
  };
}

module.exports = roleMiddleware;
