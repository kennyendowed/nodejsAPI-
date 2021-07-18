
const dotenv=require('dotenv');
dotenv.config();

module.exports = {
    HOST:   process.env.DB_HOST,
    USER:     process.env.DB_USERNAME,
    PASSWORD:     process.env.DB_PASSWORD,
    DB:   process.env.DB_DATABASE,
    dialect:   process.env.DB_CONNECTION,
    operatorsAliases:process.env.OPERATOR_ALIASES,
    pool: {
      max:  process.env.pool_max,
      min:  process.env.pool_min,
      acquire: process.env.pool_acquire,
      idle:  process.env.pool_idle
    }
  };