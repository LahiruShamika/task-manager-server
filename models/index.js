const { sequelize } = require('../config/database');
const { Sequelize, DataTypes } = require('sequelize');
const UserModel = require('./user');

const User = UserModel(sequelize, DataTypes);

const db = {
  sequelize,
  Sequelize,
  User,
};

Object.keys(db).forEach(modelName => {
  if (db[modelName] && typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

module.exports = db;
