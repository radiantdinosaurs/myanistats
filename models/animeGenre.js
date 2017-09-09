var Sequelize = require('sequelize');
var sequelize = require('../data/sequelizeDatabase');
var Anime = require('./anime');
var Genre = require('./genre');

module.exports = sequelize.define('anime_genre', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    fk_anime_id_anime_genre: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    fk_genre_id_anime_genre: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'user_anime'
});

