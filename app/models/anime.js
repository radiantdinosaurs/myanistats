const Sequelize = require('sequelize')
const sequelize = require('./sequelizeDatabase')

module.exports = sequelize.define('anime', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: false,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    link_canonical: {
        type: Sequelize.STRING
    },
    synopsis: {
        type: Sequelize.TEXT
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image: {
        type: Sequelize.STRING
    },
    synonyms: {
        type: Sequelize.TEXT
    },
    type: {
        type: Sequelize.STRING
    },
    episodes: {
        type: Sequelize.INTEGER
    },
    status: {
        type: Sequelize.STRING
    },
    aired: {
        type: Sequelize.STRING
    },
    premiered: {
        type: Sequelize.STRING
    },
    source: {
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
    number_of_votes: {
        type: Sequelize.INTEGER
    },
    ranked: {
        type: Sequelize.INTEGER
    },
    popularity: {
        type: Sequelize.INTEGER
    },
    members: {
        type: Sequelize.INTEGER
    },
    favorites: {
        type: Sequelize.INTEGER
    }}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'anime'
})
