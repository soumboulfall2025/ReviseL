const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  color: { type: String, default: '#a78bfa' }, // violet par défaut
  createdAt: { type: Date, default: Date.now },
  courses: [
    {
      title: { type: String, required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }
  ],
});

module.exports = mongoose.model('Subject', subjectSchema);
