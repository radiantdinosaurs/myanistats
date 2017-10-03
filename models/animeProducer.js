var Sequelize = require('sequelize');
var sequelize = require('./sequelizeDatabase');
var Anime = require('./anime');
var Producer = require('./producer');

module.exports = sequelize.define('anime_producer', {
    fk_anime_id_anime_producer: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    fk_producer_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'anime_producer'
});