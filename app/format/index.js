'use strict'

const controller = require('./controller')

module.exports = {
    removeFromSet: controller.removeFromSet,
    objectToSet: controller.objectToSet,
    handleMakingGenreList: controller.handleMakingGenreList,
    compileDataForResponse: controller.compileDataForResponse,
    formatAnimeForBulkInsert: controller.formatAnimeForBulkInsert,
    formatUserAnimeForBulkInsert: controller.formatUserAnimeForBulkInsert,
    formatAssociationsForBulkInsert: controller.formatAssociationsForBulkInsert
}
