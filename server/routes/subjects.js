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
    // Mapping automatique des champs français vers anglais
    let { title, content, quiz } = req.body;
    if (!title && req.body.titre) title = req.body.titre;
    // Fusionne tous les champs non standards dans content
    if (!content && req.body.contenu) content = req.body.contenu;
    if (!content) {
      // On prend tous les champs sauf title/titre, content/contenu, quiz et on les met dans content
      const reserved = ['title', 'titre', 'content', 'contenu', 'quiz'];
      content = {};
      Object.entries(req.body).forEach(([key, value]) => {
        if (!reserved.includes(key)) content[key] = value;
      });
    }
    if (!title || !content) {
      return res.status(400).json({ message: 'Les champs title/titre et content/contenu sont obligatoires.' });
    }
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Matière non trouvée.' });
    subject.courses.push({ title, content, quiz: Array.isArray(quiz) ? quiz : [] });
    await subject.save();
    res.status(201).json(subject.courses[subject.courses.length - 1]);
  } catch (err) {
    console.error('Erreur ajout cours:', err);
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

// Modifier un cours
router.put('/:id/courses/:courseId', adminOnly, async (req, res) => {
  try {
    const { title, content, quiz } = req.body;
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Matière non trouvée.' });
    const course = subject.courses.id(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Cours non trouvé.' });
    course.title = title;
    course.content = content;
    if (quiz) course.quiz = Array.isArray(quiz) ? quiz : [];
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
    const courseIndex = subject.courses.findIndex(c => c._id.toString() === req.params.courseId);
    if (courseIndex === -1) return res.status(404).json({ message: 'Cours non trouvé.' });
    subject.courses.splice(courseIndex, 1);
    await subject.save();
    res.json({ message: 'Cours supprimé.' });
  } catch (err) {
    console.error('Erreur suppression cours:', err);
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
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

// Endpoint pour toutes les fiches de révision/quiz
router.get('/all-courses', async (req, res) => {
  try {
    const subjects = await Subject.find();
    const allCourses = subjects.flatMap(s =>
      (s.courses || []).map(c => ({
        ...c.toObject(),
        subject: { _id: s._id, name: s.name, color: s.color }
      }))
    );
    res.json(allCourses);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
