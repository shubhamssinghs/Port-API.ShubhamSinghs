require('dotenv').config();

const dbConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,

  dialect: 'mysql',
  migrationStorage: 'sequelize',
  migrationStorageTableName: 'migrations'
};

console.log(dbConfig, 'consoling');

module.exports = dbConfig;
