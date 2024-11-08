const User = require('../model/user');
const Otp = require('../model/otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to generate a 6-digit OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Signup Controller (Stores OTP and User info temporarily)
exports.signup = async (req, res) => {
    const { emailOrPhone, password } = req.body;
    try {
        // Check if the user already exists in either User or Otp collection
        const existingUser = await User.findOne({ emailOrPhone });
        const existingOtp = await Otp.findOne({ emailOrPhone });

        if (existingUser || existingOtp) {
            return res.status(400).json({ error: 'User already exists or OTP already sent' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP and temporarily store user info in Otp collection
        const otp = generateOtp();
        await new Otp({ emailOrPhone, password: hashedPassword, otp }).save();
        console.log(`OTP for user ${emailOrPhone}: ${otp}`); // Log OTP for testing

        res.status(201).json({ message: 'Signup successful, OTP sent for verification' });
    } catch (error) {
        res.status(500).json({ error: 'Server error during signup' });
    }
};

// OTP Verification Controller (Saves user to database if OTP is correct)
exports.verifyOtp = async (req, res) => {
    const { emailOrPhone, otp } = req.body;

    try {
        const otpRecord = await Otp.findOne({ emailOrPhone, otp });

        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // If OTP is correct, save the user to the User collection
        const newUser = new User({
            emailOrPhone: otpRecord.emailOrPhone,
            password: otpRecord.password // Use hashed password from OTP record
        });
        await newUser.save();

        // Delete OTP record after successful verification
        await Otp.deleteOne({ emailOrPhone });

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'OTP verified successfully, user registered', token });
    } catch (error) {
        res.status(500).json({ error: 'Server error during OTP verification' });
    }
};

// Resend OTP Controller
exports.resendOtp = async (req, res) => {
    const { emailOrPhone } = req.body; 

    try {
        // Check if the user data exists in the Otp collection and is not verified
        let otpRecord = await Otp.findOne({ emailOrPhone, verified: false });

        if (!otpRecord) {
            return res.status(400).json({ error: 'No unverified OTP found for this user. Please sign up first.' });
        }

        // Generate a new OTP
        const newOtp = generateOtp();

        // Update OTP record with the new OTP and reset the expiration time
        otpRecord.otp = newOtp;
        otpRecord.createdAt = Date.now(); // Reset the creation time for expiration
        await otpRecord.save();

        console.log(`Resent OTP for user ${emailOrPhone}: ${newOtp}`); // Log OTP for testing

        res.status(200).json({ message: 'New OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error during OTP resend' });
    }
};


// Login Controller
// exports.login = async (req, res) => {
//     const { emailOrPhone, password } = req.body;
//     try {
//         // Find user in the User collection
//         const user = await User.findOne({ emailOrPhone });
//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(400).json({ error: 'Invalid email/phone or password' });
//         }

//         // Generate JWT token
//         const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.status(200).json({ message: 'Login successful', token });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error during login' });
//     }
// };

exports.login = async (req, res) => {
    const { emailOrPhone, password } = req.body;
    try {
        // Find user in the User collection
        const user = await User.findOne({ emailOrPhone });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid email/phone or password' });
        }

        // Create an access token (expires in 1 hour)
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Create a refresh token (expires in 7 days, for example)
        const refreshToken = jwt.sign(
            { userId: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        // Send both tokens in the response
        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
};
