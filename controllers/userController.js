const { User } = require('../models');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'fname', 'lname', 'email'],
      order: [['fname', 'ASC']]
    });

    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers
};

