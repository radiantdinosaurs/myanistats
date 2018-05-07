const Sequelize = require('sequelize')
const sequelize = require('../../config/database')

module.exports = sequelize.define('anime', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: false,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    title: {
        type: 'VARCHAR(255)',
        allowNull: false
    },
    link_canonical: {
        type: Sequelize.STRING,
        allowNull: true
    },
    image_url: {
        type: Sequelize.STRING,
        allowNull: true
    },
    type: {
        type: Sequelize.STRING,
        allowNull: true
    },
    source: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    episodes: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    aired_string: {
        type: Sequelize.STRING,
        allowNull: true
    },
    duration: {
        type: Sequelize.STRING,
        allowNull: true
    },
    rating: {
        type: Sequelize.STRING,
        allowNull: true
    },
    score: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    scored_by: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    rank: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    synopsis: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    background: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    premiered: {
        type: Sequelize.STRING,
        allowNull: true
    }}, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'anime'
})
