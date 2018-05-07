'use strict'

const controller = require('./controller')

module.exports = {
    removeAnimeIdFromSet: controller.removeAnimeIdFromSet,
    malListToSet: controller.malListToSet,
    compileUserStats: controller.compileUserStats,
    formatAnimeToSeedDatabaseWith: controller.formatAnimeToSeedDatabaseWith,
    formatUserRelationshipForBulkInsert: controller.formatUserRelationshipForBulkInsert,
    formatAssociationsForBulkInsert: controller.formatAssociationsForBulkInsert
}
