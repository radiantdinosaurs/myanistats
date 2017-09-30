var Sequelize = require('sequelize');
var sequelize = require('../data/sequelizeDatabase');

module.exports = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: false,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  name: {
    type: Sequelize.STRING
  },
  watching: {
    type: Sequelize.INTEGER
  },
  completed: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  on_hold: {
    type: Sequelize.INTEGER
  },
  dropped: {
    type: Sequelize.INTEGER
  },
  plan_to_watch: {
    type: Sequelize.INTEGER
  },
  days_spent_watching: {
    type: Sequelize.DECIMAL(5,2)
  }
}, {
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  tableName: 'user'
});
