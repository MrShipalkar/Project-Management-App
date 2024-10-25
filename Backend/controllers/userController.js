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

// Update user information (either name, email, or password, one at a time)
exports.updateUser = async (req, res) => {
  const { name, email, oldPassword, newPassword } = req.body;
  const userId = req.user.id;  // Assumes req.user.id is available from the JWT middleware

  try {
    // Count how many fields the user is trying to update
    let updateCount = 0;
    if (name) updateCount++;
    if (email) updateCount++;
    if (oldPassword && newPassword) updateCount++;

    // If more than one field is being updated, return an error
    if (updateCount > 1) {
      return res.status(400).json({ message: 'You can update only one field at a time' });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Update email if provided
    if (email) {
      // Check if the email is already in use by another user
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== userId) {
        return res.status(400).json({ message: 'Email is already in use by another user' });
      }
      user.email = email;
    }

    // Update password if both old and new passwords are provided
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

    // Return success message if name or email was updated
    res.status(200).json({ message: 'User updated successfully', user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserDetails = async (req, res) => {
  const userId = req.user.id;  // Assumes req.user.id is available from the JWT middleware

  try {
    // Find the user by ID
    const user = await User.findById(userId).select('name email'); // Only select name and email

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's name and email
    res.status(200).json({ name: user.name, email: user.email });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email'); // Select only necessary fields
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


