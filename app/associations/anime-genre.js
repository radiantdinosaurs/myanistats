const Sequelize = require('sequelize')
const sequelize = require('../../config/database')

module.exports = sequelize.define('anime_genre', {
    fk_anime_id_anime_genre: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: false
    },
    fk_genre_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: false
    }
}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'anime_genre'
})
