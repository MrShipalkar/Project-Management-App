const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],  // Priority levels
  },
  dueDate: {
    type: Date,  // Optional field for due dates
  },
  status: {
    type: String,
    enum: ['backlog', 'to-do', 'in-progress', 'done'],
    default: 'backlog',
  },
  checklist: [
    {
      item: { type: String, required: true },  // Checklist item description
      isCompleted: { type: Boolean, default: false },  // Mark checklist item completion
    }
  ],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to User model for task assignment
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // The creator of the task
    required: true,
  },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
