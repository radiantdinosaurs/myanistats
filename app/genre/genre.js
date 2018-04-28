const Sequelize = require('sequelize')
const sequelize = require('../database_config/connection')

module.exports = sequelize.define('genre', {
    name: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false
    }}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'genre'
})
