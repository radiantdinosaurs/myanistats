var Sequelize = require('sequelize');
var sequelize = require('../data/sequelizeDatabase');
var Anime = require('./anime');
var Licensor = require('./licensor');

var AnimeLicensor = sequelize.define('anime_licensor', {
  anime_id: Sequelize.INTEGER,
  licensor_id: Sequelize.INTEGER
});

Anime.belongsToMany(Licensor, { through: AnimeLicensor});
Licensor.belongsToMany(Anime, { through: AnimeLicensor});
