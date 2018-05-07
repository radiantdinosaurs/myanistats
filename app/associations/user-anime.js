const Sequelize = require('sequelize')
const sequelize = require('../../config/database')

module.exports = sequelize.define('user_anime', {
    fk_anime_id_user_anime: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    fk_user_id_user_anime: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    my_watched_episodes: Sequelize.INTEGER,
    my_start_date: Sequelize.DATEONLY,
    my_finish_date: Sequelize.DATEONLY,
    my_score: Sequelize.INTEGER,
    my_status: Sequelize.INTEGER,
    my_rewatching: Sequelize.INTEGER,
    my_rewatching_episodes: Sequelize.INTEGER
}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'user_anime'
})
