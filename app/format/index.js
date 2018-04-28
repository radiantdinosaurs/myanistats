'use strict'

const controller = require('./controller')

module.exports = {
    listToSet: controller.listToSet,
    removeFromSet: controller.removeFromSet,
    formatAnimeListForBulkInsert: controller.formatAnimeListForBulkInsert
}
