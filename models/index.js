// const sql= require("./db.js");
const config = require("../config/db.config.js");


const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: config.operatorsAliases,

    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/User.js")(sequelize, Sequelize);
db.role = require("../models/role.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "is_permission",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "is_permission"
});

db.ROLES = ["admin", "staff", "user"];

module.exports = db;