const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Moderate', 'High'], 
  },
  dueDate: {
    type: Date,  
  },
  status: {
    type: String,
    enum: ['backlog', 'to-do', 'in-progress', 'done'],
    default: 'to-do',
  },
  checklist: [
    {
      text: { type: String, required: true },  
      checked: { type: Boolean, default: false },
    }
  ],
  assignedTo: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
    required: true,
  },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
