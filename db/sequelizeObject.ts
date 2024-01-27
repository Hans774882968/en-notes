import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);
const pathsDotenv = resolveApp('.env');

dotenv.config({
  path: `${pathsDotenv}.local`
});

export const sequelizeObject = new Sequelize(
  process.env.MYSQL_DATABASE || '',
  process.env.MYSQL_USER || '',
  process.env.MYSQL_PASSWORD || '',
  {
    dialect: 'mysql',
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    },
    host: process.env.MYSQL_HOST,
    pool: {
      idle: parseInt(process.env.MYSQL_POOL_IDLE || ''),
      max: parseInt(process.env.MYSQL_POOL_MAX || ''),
      min: parseInt(process.env.MYSQL_POOL_MIN || '')
    },
    port: +(process.env.MYSQL_PORT || ''),
    timezone: '+08:00'
  }
);
