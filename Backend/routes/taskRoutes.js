const express = require('express');
const {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
  getTasks,
  getTaskById
} = require('../controllers/taskController');
const auth = require('../middleware/auth');  // Middleware to protect routes

const router = express.Router();

// Create a new task
router.post('/', auth, createTask);

// Get all tasks created by the user
router.get('/', auth, getUserTasks);

// Update a task
router.put('/:taskId', auth, updateTask);

// Delete a task
router.delete('/:taskId', auth, deleteTask);
router.get('/filter',auth, getTasks);
router.get('/:taskId', auth, getTaskById);

module.exports = router;
