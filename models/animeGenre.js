var Sequelize = require('sequelize');
var sequelize = require('../data/sequelizeDatabase');
var Anime = require('./anime');
var Genre = require('./genre');

var AnimeGenre = sequelize.define('anime_genre', {
  anime_id: Sequelize.INTEGER,
  genre_id: Sequelize.INTEGER
});

Anime.belongsToMany(Genre, { through: AnimeGenre});
Genre.belongsToMany(Anime, { through: AnimeGenre});
