// models/otpModel.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  emailOrPhone: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // OTP expires in 5 minutes
});

module.exports = mongoose.model('OTP', otpSchema);
