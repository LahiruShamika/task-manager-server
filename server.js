require('dotenv').config();
const app = require('./app');
const models = require('./models');

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await models.sequelize.authenticate();
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
