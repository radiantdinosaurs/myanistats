const Sequelize = require('sequelize')
const sequelize = require('../config/index')

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
})
