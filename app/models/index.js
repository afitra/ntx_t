const config = require("../config/db");

const Sequelize = require("sequelize");
const sequelize = new Sequelize('ntx','root','root', {
  host: config.HOST,
  port:5433,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// define model example
// db.user = require("../models/User")(sequelize, Sequelize);

// relation example
// relation between role and user
// db.role.hasMany(db.user, {
//   as: "users",
//   onDelete: "cascade",
//   onUpdate: "cascade",
// });

// db.user.belongsTo(db.role, {
//   foreignKey: "roleId",
//   as: "role",
// });

module.exports = db;
