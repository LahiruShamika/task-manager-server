const { Task, User } = require('../models');
const { body, validationResult } = require('express-validator');

const taskValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  body('assignedTo').optional().isInt().withMessage('Invalid user ID'),
  body('isCompleted').optional().isBoolean().withMessage('Invalid completion status')
];

const getTasks = async (req, res, next) => {
  try {
    const { status } = req.query;
    const whereClause = {};

    if (status === 'completed') {
      whereClause.isCompleted = true;
    } else if (status === 'pending') {
      whereClause.isCompleted = false;
    }

    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'fname', 'lname', 'email']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fname', 'lname', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ tasks });
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'fname', 'lname', 'email']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fname', 'lname', 'email']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ task });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { title, description, dueDate, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      dueDate,
      assignedTo,
      isCompleted: false,
      createdBy: req.user.id
    });

    const taskWithRelations = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'fname', 'lname', 'email']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fname', 'lname', 'email']
        }
      ]
    });

    res.status(201).json({ message: 'Task created successfully', task: taskWithRelations });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, dueDate, assignedTo, isCompleted } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.title = title !== undefined ? title : task.title;
    task.description = description !== undefined ? description : task.description;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
    task.isCompleted = isCompleted !== undefined ? isCompleted : task.isCompleted;

    await task.save();

    const taskWithRelations = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'fname', 'lname', 'email']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fname', 'lname', 'email']
        }
      ]
    });

    res.status(200).json({ message: 'Task updated successfully', task: taskWithRelations });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const toggleTaskCompletion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.isCompleted = !task.isCompleted;
    await task.save();

    const taskWithRelations = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'fname', 'lname', 'email']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fname', 'lname', 'email']
        }
      ]
    });

    res.status(200).json({ message: 'Task status updated', task: taskWithRelations });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  taskValidators,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion
};

