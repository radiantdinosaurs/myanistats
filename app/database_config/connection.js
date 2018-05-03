const Sequelize = require('sequelize')

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'host',
    port: 'port',
    dialect: 'dialect'
})

module.exports = sequelize
