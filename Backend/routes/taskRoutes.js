const express = require('express');
const {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
  getTasks,
  getTaskById,
  assignTasksToUser,
  publicshare
} = require('../controllers/taskController');
const auth = require('../middleware/auth');  


const router = express.Router();


router.post('/', auth, createTask);


router.get('/', auth, getUserTasks);
router.put('/:taskId', auth, updateTask);
router.delete('/:taskId', auth, deleteTask);
router.get('/filter',auth, getTasks);
router.get('/:taskId', auth, getTaskById);



router.patch('/assign', auth, assignTasksToUser);



router.get('/task/:taskId', publicshare);





module.exports = router;
