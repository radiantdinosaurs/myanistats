'use strict'

const controller = require('./controller')

module.exports = {
    bulkInsertRelationship: controller.bulkInsertRelationship,
    bulkInsertGenre: controller.bulkInsertGenre,
    bulkInsertStudio: controller.bulkInsertStudio,
    bulkInsertLicensor: controller.bulkInsertLicensor,
    bulkInsertProducer: controller.bulkInsertProducer
}
