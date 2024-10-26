const Task = require("../models/Task.js");
const User = require('../models/User.js');
const mongoose = require('mongoose');


// Create a new task
exports.createTask = async (req, res) => {
  const { title, priority, dueDate, checklist, assignedTo } = req.body;

  try {
    console.log(req.body);
    if (!title || !priority || !checklist) {
      return res
        .status(400)
        .json({ message: "Title, priority, and checklist are required" });
    }


    const task = new Task({
      title,
      priority,
      dueDate,
      checklist, 
      status: "to-do", 
      createdBy: req.user.id,
      assignedTo,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Server error" });
  }
};



exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id  },  )
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, priority, dueDate, checklist, status, assignedTo } = req.body;

  try {
      const task = await Task.findById(taskId);

      if (!task) {
          return res.status(404).json({ message: "Task not found" });
      }

     
      if (task.createdBy.toString() === req.user.id) {
          task.title = title || task.title;
          task.priority = priority || task.priority;
          task.dueDate = dueDate || task.dueDate;
          task.checklist = checklist || task.checklist;
          task.status = status || task.status;
          task.assignedTo = assignedTo || task.assignedTo;  
      } 
      
      else if (task.assignedTo.toString() === req.user.id) {
          task.title = title || task.title;
          task.priority = priority || task.priority;
          task.dueDate = dueDate || task.dueDate;
          task.checklist = checklist || task.checklist;
          task.status = status || task.status;
      
      } 
      else {
          return res.status(403).json({ message: "Unauthorized" });
      }

      await task.save();
      res.status(200).json(task );
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};



exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
      const task = await Task.findById(taskId);

      if (!task) {
          return res.status(404).json({ message: "Task not found" });
      }

      
      if (task.createdBy.toString() !== req.user.id && task.assignedTo.toString() !== req.user.id) {
          return res.status(403).json({ message: "Unauthorized. Only the creator or assigned user can delete this task." });
      }

     
      await task.deleteOne();
      res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: "Server error" });
  }
};

  
exports.getTasks = async (req, res) => {
  try {
      const { filter } = req.query;

      let filterCriteria = {
          $or: [
              { createdBy: req.user.id },    
              { assignedTo: req.user.id },  
          ],
      };

      
      if (filter === 'Today') {
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          const todayEnd = new Date();
          todayEnd.setHours(23, 59, 59, 999);

          filterCriteria.dueDate = {
              $gte: todayStart,
              $lte: todayEnd,
          };
      } else if (filter === 'This Week') {
          const today = new Date();
          const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
          firstDayOfWeek.setHours(0, 0, 0, 0);
          const lastDayOfWeek = new Date(firstDayOfWeek);
          lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
          lastDayOfWeek.setHours(23, 59, 59, 999);

          filterCriteria.dueDate = {
              $gte: firstDayOfWeek,
              $lte: lastDayOfWeek,
          };
      } else if (filter === 'This Month') {
          const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
          const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
          lastDayOfMonth.setHours(23, 59, 59, 999);

          filterCriteria.dueDate = {
              $gte: firstDayOfMonth,
              $lte: lastDayOfMonth,
          };
      }

     
      const tasks = await Task.find(filterCriteria)
          .populate('assignedTo', 'name email'); 

      res.status(200).json(tasks);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching tasks' });
  }
};




exports.getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;
        
        
        console.log('Received taskId:', taskId);

       
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            console.error('Invalid task ID format');
            return res.status(400).json({ message: 'Invalid task ID format' });
        }

      
        const task = await Task.findById(taskId).populate('assignedTo', 'name email');

        if (!task) {
            console.error('Task not found:', taskId);
            return res.status(404).json({ message: 'Task not found' });
        }

       
        const isCreator = task.createdBy.toString() === req.user.id;
        
        
        console.log('Task found:', task);
        console.log('Is user the creator?', isCreator);

        res.status(200).json({ task, isCreator });
    } catch (error) {
        
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.assignTasksToUser = async (req, res) => {
    try {
      const { email } = req.body;
      const currentUserId = req.user.id;
  
      console.log("Received email:", email);
      console.log("Current User ID:", currentUserId);
  

      const assignToUser = await User.findOne({ email });
      if (!assignToUser) {
        console.log("User not found for email:", email);
        return res.status(404).json({ message: "User not found" });
      }
      console.log("Assigning tasks to User ID:", assignToUser._id);
  
      
      const tasksToUpdate = await Task.find({ createdBy: currentUserId });
      console.log("Number of tasks to update:", tasksToUpdate.length);
  
      if (tasksToUpdate.length === 0) {
        return res.status(404).json({ message: "No tasks found to assign" });
      }
  
     
      const updateResult = await Task.updateMany(
        { createdBy: currentUserId },
        { $set: { assignedTo: assignToUser._id } }
      );
  
      res.status(200).json({
        message: `All tasks created by you have been assigned to ${email}.`,
        updatedCount: updateResult.modifiedCount,
      });
    } catch (error) {
      console.error("Error in assignTasksToUser:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  exports.publicshare = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
