const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword, // Use the hashed password
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res
    .status(201)
    .header("auth-token", token)
    .json({
      message: "User Registered successfully",
      token,
      user: { id: user._id, username: user.name }, // Assuming 'name' is used as 'username'
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res
    .status(200)
    .header("auth-token", token)
    .json({
        message: "User Logged-In successfully",
        token,
        user: { id: user._id, username: user.name }, // Assuming 'name' is used as 'username'
      });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user information (name or password)
exports.updateUser = async (req, res) => {
  const { name, oldPassword, newPassword } = req.body;
  const userId = req.user.id;  // Assumes req.user.id is available from the JWT middleware

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Update password if old and new passwords are provided
    if (oldPassword && newPassword) {
      // Check if the old password matches the one in the database
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Old password is incorrect' });
      }

      // Hash the new password before saving
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Save the updated user data
    await user.save();

    // If the password was updated, log the user out (invalidate token)
    if (oldPassword && newPassword) {
      return res.status(200).json({ message: 'Password updated successfully. Please log in again.' });
    }

    // Return success message if only name was updated
    res.status(200).json({ message: 'User updated successfully', user: { name: user.name } });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};