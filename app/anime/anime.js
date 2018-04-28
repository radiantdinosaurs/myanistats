const Sequelize = require('sequelize')
const sequelize = require('../database_config/connection')

module.exports = sequelize.define('anime', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: false,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    link_canonical: {
        type: Sequelize.STRING
    },
    image_url: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.STRING
    },
    source: {
        type: Sequelize.TEXT
    },
    episodes: {
        type: Sequelize.INTEGER
    },
    aired_string: {
        type: Sequelize.STRING
    },
    duration: {
        type: Sequelize.STRING
    },
    rating: {
        type: Sequelize.STRING
    },
    score: {
        type: Sequelize.INTEGER
    },
    scored_by: {
        type: Sequelize.INTEGER
    },
    rank: {
        type: Sequelize.INTEGER
    },
    synopsis: {
        type: Sequelize.TEXT
    },
    background: {
        type: Sequelize.TEXT
    },
    premiered: {
        type: Sequelize.STRING
    }}, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'anime'
})
