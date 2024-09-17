import { Sequelize, Dialect } from 'sequelize';
import config from '../config/database.json';

interface DatabaseConfig {
  username: string;
  password: string | null;
  database: string;
  host: string;
  dialect: Dialect;
}

const nodeEnv = process.env.NODE_ENV || 'development';

const typedConfig: {
  [key: string]: Omit<DatabaseConfig, 'dialect'> & { dialect: string };
} = config;

const { username, password, database, host, dialect } = typedConfig[nodeEnv];

const sequelize = new Sequelize(database, username, password ?? undefined, {
  host,
  dialect: dialect as Dialect,
  logging: true
});

export default sequelize;
