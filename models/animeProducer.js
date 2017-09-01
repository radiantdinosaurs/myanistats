var Sequelize = require('sequelize');
var sequelize = require('../data/sequelizeDatabase');
var Anime = require('./anime');
var Producer = require('./producer');

var AnimeProducer = sequelize.define('anime_producer', {
  anime_id: Sequelize.INTEGER,
  producer_id: Sequelize.INTEGER
});

Anime.belongsToMany(Producer, { through: AnimeProducer});
Producer.belongsToMany(Anime, { through: AnimeProducer});
