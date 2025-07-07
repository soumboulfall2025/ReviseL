const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.env.ADMIN_EMAIL ;
  const username = process.env.ADMIN_USERNAME ;
  const password = process.env.ADMIN_PASSWORD; // À changer après première connexion !
  const hash = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'admin';
    existing.password = hash;
    await existing.save();
    console.log('Utilisateur admin mis à jour.');
  } else {
    await User.create({ username, email, password: hash, role: 'admin' });
    console.log('Utilisateur admin créé.');
  }
  mongoose.disconnect();
}

createAdmin();
