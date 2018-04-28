const Sequelize = require('sequelize')

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'host',
    port: 'port',
    dialect: 'dialect'
})

module.exports = sequelize
