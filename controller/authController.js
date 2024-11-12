// controllers/authController.js
const User = require('../model/user');
const OTP = require('../model/otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const signup = async (req, res) => {
  const { emailOrPhone, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    const existingUser = await User.findOne({ emailOrPhone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const otpCode = generateOTP();
    await OTP.create({ emailOrPhone, otp: otpCode });

    res.status(201).json({ message: 'OTP generated successfully.', otp: otpCode });
  } catch (error) {
    res.status(500).json({ message: 'Error generating OTP.', error });
  }
};

const verifyOTP = async (req, res) => {
  const { emailOrPhone, otp, password } = req.body;

  try {
    const otpRecord = await OTP.findOne({ emailOrPhone, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ emailOrPhone, password: hashedPassword });
    await newUser.save();

    await OTP.deleteOne({ _id: otpRecord._id });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully.', token });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP.', error });
  }
};

const signin = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const user = await User.findOne({ emailOrPhone });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate Access Token (short-lived)
    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Generate Refresh Token (long-lived)
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Console log the role, access token, and refresh token
    console.log(`Role: ${user.role}`);
    console.log(`Access Token: ${accessToken}`);
    console.log(`Refresh Token: ${refreshToken}`);

    res.status(200).json({
      message: 'Logged in successfully.',
      accessToken,
      refreshToken,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in.', error });
  }
};

module.exports = { signup, verifyOTP, signin };
