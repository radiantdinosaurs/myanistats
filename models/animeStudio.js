var Sequelize = require('sequelize');
var sequelize = require('../data/sequelizeDatabase');
var Anime = require('./anime');
var Studio = require('./Studio');

module.exports = sequelize.define('anime_studio', {
    fk_anime_id_anime_studio: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    fk_studio_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'anime_studio'
});