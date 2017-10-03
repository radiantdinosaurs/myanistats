var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password', {
  host: 'host',
  dialect: 'dialect',
  port: 'port'
});
module.exports = sequelize;