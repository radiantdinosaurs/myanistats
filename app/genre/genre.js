const Sequelize = require('sequelize')
const sequelize = require('../../config/database')

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
