const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Mot de passe reçu :', password); 
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ message: 'Utilisateur déjà existant.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    res.status(201).json({ message: 'Inscription réussie.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Mot de passe reçu :', password);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Utilisateur introuvable.' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Mot de passe incorrect.' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Mise à jour du profil utilisateur
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Non autorisé.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { username, email, phone, photo } = req.body;
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { username, email, phone, photo },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      photo: user.photo,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Liste des utilisateurs (admin)
router.get('/users', adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Suppression utilisateur (admin)
router.delete('/users/:id', adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Statistiques globales (admin)
router.get('/stats', adminOnly, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    // Ajoute ici d'autres stats (ex: devoirs soumis...)
    res.json({ userCount });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Modification du rôle utilisateur (admin)
router.put('/users/:id', adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ message: 'Rôle invalide.' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json({ message: 'Rôle mis à jour.', user });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
