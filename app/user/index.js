'use strict'

const controller = require('./controller')

module.exports = {
    findOneByUsername: controller.findOneByUsername,
    findOrCreate: controller.findOrCreate,
    update: controller.update,
    bulkInsertUserAnimeRelationship: controller.bulkInsertUserAnimeRelationship
}
