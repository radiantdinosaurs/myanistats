var Sequelize = require('sequelize');
var sequelize = require('../data/sequelizeDatabase');

module.exports = sequelize.define('producer', {
    name: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    jikan_id: {
        type: Sequelize.STRING,
        unique: true
    }
}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'producer'
});
