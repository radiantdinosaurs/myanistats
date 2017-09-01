var Sequelize = require('sequelize');
var sequelize = require('../data/sequelizeDatabase');
var Anime = require('./anime');
var Studio = require('./studio');

var AnimeStudio = sequelize.define('anime_studio', {
  anime_id: Sequelize.INTEGER,
  studio_id: Sequelize.INTEGER
});

Anime.belongsToMany(Studio, { through: AnimeStudio});
Studio.belongsToMany(Anime, { through: AnimeStudio});
