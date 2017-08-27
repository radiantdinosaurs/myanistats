var Sequelize = require('sequelize');
var sequelize = require('../app.js');

module.exports = (sequelize, Sequelize) => {
  return sequelize.define('genre', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    jikan_id: {
      type: Sequelize.STRING
    },
    genre_name: {
      type: Sequelize.INTEGER
    }
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'genre'
  });
}
