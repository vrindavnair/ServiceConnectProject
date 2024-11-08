// const mongoose = require('mongoose');

// const otpSchema = new mongoose.Schema({
//     emailOrPhone: { type: String, required: true },
//     otp: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now, expires: 300 }, // 5-minute expiration
//     verified: { type: Boolean, default: false } // Add verified field
// });

// module.exports = mongoose.model('Otp', otpSchema);

const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    emailOrPhone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Automatically delete after 5 minutes
    },
    verified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('otp', otpSchema);
