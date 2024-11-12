// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  emailOrPhone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' } // default role is 'user'
});

module.exports = mongoose.model('User', userSchema);

