const Task = require("../models/Task");

// Create a new task
exports.createTask = async (req, res) => {
  const { title, priority, dueDate, checklist, assignedTo } = req.body;

  try {
    // Log the request body to check what is being sent
    console.log(req.body);

    // Check for required fields
    if (!title || !priority || !checklist) {
      return res
        .status(400)
        .json({ message: "Title, priority, and checklist are required" });
    }

    // Create the task
    const task = new Task({
      title,
      priority,
      dueDate,
      checklist, // Ensure checklist matches your expected structure
      status: "to-do", // Initial status is 'backlog'
      createdBy: req.user.id, // Assuming req.user.id comes from JWT middleware
      assignedTo,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error); // Log the error to inspect
    res.status(500).json({ message: "Server error" });
  }
};


// Get all tasks created by the logged-in user
exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update an existing task
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, priority, dueDate, checklist, status, assignedTo } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only the creator of the task can update it
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update the task properties
    task.title = title || task.title;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.checklist = checklist || task.checklist;
    task.status = status || task.status;
    task.assignedTo = assignedTo || task.assignedTo;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    const { taskId } = req.params;
  
    try {
      const task = await Task.findById(taskId);
  
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      // Only the creator of the task can delete it
      if (task.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      // Use deleteOne instead of remove
      await task.deleteOne();
      res.status(200).json({ message: "Task deleted" });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  exports.getTasks = async (req, res) => {
    try {
        const { filter } = req.query;

        let filterCriteria = {};

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
            const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
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

        const tasks = await Task.find(filterCriteria);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
};