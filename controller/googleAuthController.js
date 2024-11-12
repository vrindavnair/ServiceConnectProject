// controllers/authController.js
const axios = require('axios');
const jwt = require('jsonwebtoken');
const google = require('../model/google');
const dotenv = require('dotenv');
dotenv.config();

const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify the token with Google
        const googleResponse = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        const { email, name, picture, sub: googleId } = googleResponse.data;

        // Check if the user already exists in the database
        let user = await google.findOne({ email });
        if (!user) {
            // If user doesn't exist, create a new user
            user = new google({ googleId, email, name, picture });
            await user.save();
        }

        // Generate a JWT for the authenticated user
        const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            jwtToken,
            user: {
                email: user.email,
                name: user.name,
                picture: user.picture
            }
        });
    } catch (error) {
        console.error('Error during Google token verification:', error);
        res.status(400).json({ message: 'Invalid Google token' });
    }
};

module.exports = { googleLogin };
