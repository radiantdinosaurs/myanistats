const Sequelize = require('sequelize')
const sequelize = require('../database_config/connection')

module.exports = sequelize.define('anime_licensor', {
    fk_anime_id_anime_licensor: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    fk_licensor_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'anime_licensor'
})
