const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
 
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   
    const user = new User({
      name,
      email,
      password: hashedPassword, 
    });

    await user.save();

   
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res
    .status(201)
    .header("auth-token", token)
    .json({
      message: "User Registered successfully",
      token,
      user: { id: user._id, username: user.name },
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

 
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res
    .status(200)
    .header("auth-token", token)
    .json({
        message: "User Logged-In successfully",
        token,
        user: { id: user._id, username: user.name }, 
      });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateUser = async (req, res) => {
  const { name, email, oldPassword, newPassword } = req.body;
  const userId = req.user.id; 

  try {
   
    let updateCount = 0;
    if (name) updateCount++;
    if (email) updateCount++;
    if (oldPassword && newPassword) updateCount++;

 
    if (updateCount > 1) {
      return res.status(400).json({ message: 'You can update only one field at a time' });
    }

    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    if (name) {
      user.name = name;
    }

   
    if (email) {
      
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== userId) {
        return res.status(400).json({ message: 'Email is already in use by another user' });
      }
      user.email = email;
    }

  
    if (oldPassword && newPassword) {
   
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Old password is incorrect' });
      }

    
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

   
    await user.save();

   
    if (oldPassword && newPassword) {
      return res.status(200).json({ message: 'Password updated successfully. Please log in again.' });
    }

    res.status(200).json({ message: 'User updated successfully', user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserDetails = async (req, res) => {
  const userId = req.user.id;  

  try {
    // Find the user by ID
    const user = await User.findById(userId).select('name email'); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ name: user.name, email: user.email });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email'); 
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


