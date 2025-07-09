const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  title: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: true }, // Accepte string ou objet JSON
  quiz: { type: [Schema.Types.Mixed], default: [] }, // Ajout du champ quiz
  createdAt: { type: Date, default: Date.now },
});

const subjectSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  color: { type: String, default: '#a78bfa' }, // violet par défaut
  createdAt: { type: Date, default: Date.now },
  courses: [courseSchema],
});

module.exports = mongoose.model('Subject', subjectSchema);
