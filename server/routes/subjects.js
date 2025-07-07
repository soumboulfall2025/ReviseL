const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const adminOnly = require('../middleware/adminOnly');

// Liste des matières (publique)
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Création
router.post('/', adminOnly, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const subject = await Subject.create({ name, description, color });
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Modification
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const subject = await Subject.findByIdAndUpdate(req.params.id, { name, description, color }, { new: true });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Suppression
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Matière supprimée.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Récupérer les cours d'une matière
router.get('/:id/courses', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Matière non trouvée.' });
    res.json(subject.courses || []);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Ajouter un cours à une matière
router.post('/:id/courses', adminOnly, async (req, res) => {
  try {
    const { title, content } = req.body;
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Matière non trouvée.' });
    subject.courses.push({ title, content });
    await subject.save();
    res.status(201).json(subject.courses[subject.courses.length - 1]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Modifier un cours
router.put('/:id/courses/:courseId', adminOnly, async (req, res) => {
  try {
    const { title, content } = req.body;
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Matière non trouvée.' });
    const course = subject.courses.id(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Cours non trouvé.' });
    course.title = title;
    course.content = content;
    await subject.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Supprimer un cours
router.delete('/:id/courses/:courseId', adminOnly, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Matière non trouvée.' });
    subject.courses.id(req.params.courseId).remove();
    await subject.save();
    res.json({ message: 'Cours supprimé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Récupérer une matière par son ID
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Matière non trouvée.' });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
