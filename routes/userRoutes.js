const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', getAllUsers);

module.exports = router;

