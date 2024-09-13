const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '1d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        user = new User({ name, email, password, role });
        await user.save();

        // Send back the JWT token
        const token = generateToken(user._id);
        res.status(201).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Match the password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Send back the JWT token
        const token = generateToken(user._id);
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getUser = async (req, res) => {
    try {
        // Decode token to get user ID
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};