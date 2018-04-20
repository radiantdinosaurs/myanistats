const Sequelize = require('sequelize')
const sequelize = require('../config/index')

module.exports = sequelize.define('genre', {
    name: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    jikan_id: {
        type: Sequelize.STRING,
        unique: true
    }}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'genre'
})
