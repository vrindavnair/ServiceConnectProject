const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const otps = {};         // Temporary storage for OTPs
const verifiedUsers = {};  // Track verified users by ID

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
}

function sendOtpToConsole(userId, otp) {
    console.log(`OTP for user ${userId}: ${otp}`);
}

// Signup Controller
exports.signup = async (req, res) => {
    const { emailOrPhone, password } = req.body;
    try {
        // Check if user already exists
        let user = await User.findOne({ emailOrPhone });
        if (user) return res.status(400).json({ error: 'User already exists' });

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ emailOrPhone, password: hashedPassword });
        await user.save();

        // Generate and store OTP
        const otp = generateOtp();
        otps[user._id] = otp;
        sendOtpToConsole(user._id, otp);

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'Signup successful, OTP sent for verification', token });
    } catch (error) {
        res.status(500).json({ error: 'Server error during signup' });
    }
};

// OTP Verification Controller
exports.verifyOtp = async (req, res) => {
    const { userId, otp } = req.body;

    // Check if OTP is correct
    if (otps[userId] && otps[userId] === otp) {
        verifiedUsers[userId] = true; // Mark user as verified
        delete otps[userId]; // Clear OTP after verification
        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        res.status(400).json({ error: 'Invalid OTP' });
    }
};

// Login Controller
exports.login = async (req, res) => {
    const { emailOrPhone, password } = req.body;
    try {
        const user = await User.findOne({ emailOrPhone });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid email/phone or password' });
        }

        // Check if the user is verified
        if (!verifiedUsers[user._id]) {
            return res.status(403).json({ error: 'User not verified. Please verify your OTP first.' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
};
