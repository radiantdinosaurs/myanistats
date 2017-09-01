var Sequelize = require('sequelize');
var sequelize = require('../data/sequelizeDatabase');
var Anime = require('./anime');
var User = require('./user');

var UserAnime = sequelize.define('user_anime', {
  anime_id: Sequelize.INTEGER,
  user_id: Sequelize.INTEGER,
  my_watched_episodes: Sequelize.INTEGER,
  my_start_date: Sequelize.DATE,
  my_finish_date: Sequelize.DATE,
  my_score: Sequelize.INTEGER,
  my_status: Sequelize.INTEGER,
  my_rewatching: Sequelize.INTEGER,
  my_rewatching_episodes: Sequelize.INTEGER
});

Anime.belongsToMany(User, { through: UserAnime});
User.belongsToMany(Anime, { through: UserAnime});
