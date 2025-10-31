const express = require('express');
const router = express.Router();
const {
  taskValidators,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion
} = require('../controllers/taskController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', taskValidators, createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTaskCompletion);

module.exports = router;

