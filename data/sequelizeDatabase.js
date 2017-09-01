var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  port: 'port'
});
module.exports = sequelize;
