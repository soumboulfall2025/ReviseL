const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/correct', async (req, res) => {
  try {
    const { subject, content } = req.body;
    if (!content) return res.status(400).json({ message: 'Texte requis.' });
    const prompt = `Corrige ce devoir de ${subject} pour le bac L Sénégal, donne une note sur 20, un commentaire pédagogique et des axes d'amélioration. Voici le texte :\n${content}`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600
    });
    const feedback = completion.choices[0].message.content;
    res.json({ feedback });
  } catch (err) {
    console.error('Erreur OpenAI:', err.response?.data || err.message || err);
    res.status(500).json({ message: 'Erreur IA.', error: err.response?.data || err.message || err });
  }
});

module.exports = router;
