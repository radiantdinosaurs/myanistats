var Sequelize = require('sequelize');
var sequelize = require('../app.js');

module.exports = (sequelize, Sequelize) => {
  return sequelize.define('anime', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: false,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    link_canonical: {
      type: Sequelize.STRING
    },
    synopsis: {
      type: Sequelize.TEXT
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING
    },
    synonyms: {
      type: Sequelize.TEXT
    },
    japanese: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    episodes: {
      type: Sequelize.INTEGER
    },
    status: {
      type: Sequelize.STRING
    },
    aired: {
      type: Sequelize.STRING
    },
    premiered: {
      type: Sequelize.STRING
    },
    broadcast: {
      type: Sequelize.STRING
    },
    producer: {
      type: Sequelize.INTEGER,
      references: 'producer',
      referencesKey: 'id'
    },
    licensor: {
      type: Sequelize.INTEGER,
      references: 'licensor',
      referencesKey: 'id'
    },
    studio: {
      type: Sequelize.INTEGER,
      references: 'studio',
      referencesKey: 'id'
    },
    source: {
      type: Sequelize.STRING
    },
    genre: {
      type: Sequelize.INTEGER,
      references: 'genre',
      referencesKey: 'id'
    },
    duration: {
      type: Sequelize.STRING
    },
    rating: {
      type: Sequelize.STRING
    },
    score: {
      type: Sequelize.INTEGER
    },
    number_of_votes: {
      type: Sequelize.INTEGER
    },
    ranked: {
      type: Sequelize.INTEGER
    },
    popularity: {
      type: Sequelize.INTEGER
    },
    members: {
      type: Sequelize.INTEGER
    },
    favorites: {
      type: Sequelize.INTEGER
    },
    background: {
      type: Sequelize.TEXT
    },
    opening_theme: {
      type: Sequelize.TEXT
    },
    ending_theme: {
      type: Sequelize.TEXT
    }
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'anime'
  });
}
