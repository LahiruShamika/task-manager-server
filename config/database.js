import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'sqlite:./task_managment_db.sqlite',
  {
    logging: false,
    dialectOptions: {
      useUTC: true,
    },
  }
);

export default sequelize;
