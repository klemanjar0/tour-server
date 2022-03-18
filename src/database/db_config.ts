import { config as initialize_env } from 'dotenv';
import { Dialect } from 'sequelize';

initialize_env();

export default {
  database: (process.env.DATABASE_NAME as string) || 'tour-db',
  dialect: (process.env.DATABASE_DIALECT as Dialect) || 'postgres',
  username: (process.env.DATABASE_USERNAME as string) || 'postgres',
  password: (process.env.DATABASE_PASSWORD as string) || '123456',
  host: (process.env.DATABASE_HOST as string) || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
};
