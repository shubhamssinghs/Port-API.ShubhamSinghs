import { Sequelize, Dialect } from 'sequelize';
import config from '../config/database.js';

const { username, password, database, host, dialect } = config;

let sequelize: Sequelize | undefined;

if (database && username) {
  sequelize = new Sequelize(database, username, password ?? undefined, {
    host,
    dialect: dialect as Dialect,
    logging: true
  });
} else {
  console.error('Configuration Error! Please check db configuration.');
}

export default sequelize;
