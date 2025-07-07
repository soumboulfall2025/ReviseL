const jwt = require('jsonwebtoken');

function adminOnly(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Non autorisé.' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Accès réservé à l’admin.' });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide.' });
  }
}

module.exports = adminOnly;
