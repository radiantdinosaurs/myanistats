'use strict'

const controller = require('./controller')

module.exports = {
    findOrCreateUser: controller.findOrCreateUser,
    updateUser: controller.updateUser
}
