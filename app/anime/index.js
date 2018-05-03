'use strict'

const controller = require('./controller')

module.exports = {
    findAllById: controller.findAllById,
    findAllByUserId: controller.findAllByUserId,
    bulkInsert: controller.bulkInsert
}
