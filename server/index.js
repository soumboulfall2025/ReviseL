const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const iaRoutes = require('./routes/ia');
const subjectRoutes = require('./routes/subjects');
const progressRoutes = require('./routes/progress');

const app = express();

const allowedOrigins = [
  'https://revisel-admin.onrender.com',
  'http://localhost:5173', // pour le dev local
  'https://revisel-client.onrender.com' // nouvel origin autorisé
];

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (ex: mobile, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ia', iaRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/progress', progressRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log('Serveur démarré sur le port', PORT));
  })
  .catch((err) => console.error('Erreur MongoDB:', err));
