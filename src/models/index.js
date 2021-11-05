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
    dialectOptions: {
      "ssl": {
        "require":true,
        "rejectUnauthorized": false
      }
    },
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
db.User_Login = require("../models/User_Login.js")(sequelize, Sequelize);
db.role = require("../models/role.js")(sequelize, Sequelize);
db.Blacklist_Token = require("../models/Blacklist_Token.js")(sequelize, Sequelize);

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
db.User_Login.belongsTo(db.user, {
  as: "user_details",
  foreignKey: "userId",
  constraints: false
});

db.ROLES = ["admin", "staff", "user"];

module.exports = db;