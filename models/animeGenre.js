var Sequelize = require('sequelize');
var sequelize = require('./sequelizeDatabase');
var Anime = require('./anime');
var Genre = require('./genre');

module.exports = sequelize.define('anime_genre', {
    fk_anime_id_anime_genre: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    fk_genre_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'anime_genre'
});