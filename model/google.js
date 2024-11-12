// models/userModel.js
const mongoose = require('mongoose');

const googleSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: String,
    picture: String
});

module.exports = mongoose.model('google', googleSchema);
