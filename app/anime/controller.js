'use strict'

const logger = require('../logging/index')
const returnError = require('../errors/index')

function recordNeedsUpdating(userLastUpdated) {
    const currentDate = new Date()
    const timeDifference = Math.abs(currentDate.getTime() - userLastUpdated.getTime())
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24))
    if (dayDifference <= 5) {
        logger.log('info', 'Doesnt need to be updated')
        return false
    } else return true
}
