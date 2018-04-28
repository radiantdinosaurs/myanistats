'use strict'

const controller = require('./controller')

module.exports = {
    requestMalUser: controller.requestMalUser,
    requestJikanAnime: controller.requestJikanAnime,
    handleMakingBulkJikanRequests: controller.handleMakingBulkJikanRequests
}
