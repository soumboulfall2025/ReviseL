const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Subject = require('../models/Subject');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware pour vérifier l'utilisateur connecté
function authOnly(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Non autorisé.' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide.' });
  }
}

// Soumettre un devoir
router.post('/', authOnly, async (req, res) => {
  try {
    const { subject, content, note, feedback } = req.body;
    const submission = await Submission.create({
      user: req.user.id,
      subject,
      content,
      note,
      feedback
    });
    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Progression de l'utilisateur (toutes ses soumissions)
router.get('/me', authOnly, async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.id }).populate('subject');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Liste des matières (publique)
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Progression d'un étudiant par son ID (admin)
router.get('/user/:id', async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.params.id })
      .populate('subject')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
