var Sequelize = require('sequelize');
var sequelize = require('../data/sequelizeDatabase');

module.exports = sequelize.define('producer', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  jikan_id: {
    type: Sequelize.STRING
  },
  producer_name: {
    type: Sequelize.INTEGER
  }
}, {
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'producer'
});
