'use strict'

const returnError = require('../errors/index')
const requestController = require('../request/index')
const userClient = require('./user-client')
const logger = require('../logging/index')

function recordNeedsUpdating(userLastUpdated) {
    const currentDate = new Date()
    const timeDifference = Math.abs(currentDate.getTime() - userLastUpdated.getTime())
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24))
    return dayDifference <= 5
}

function handleGettingUser(username) {
    if (username) {
        return userClient.findUserByUsername(username).then((user) => {
            if (user && !recordNeedsUpdating(user.dataValues.updated_at)) {
                user.updatedOrCreated = false
                return user
            } else if (user && recordNeedsUpdating(user.dataValues.updated_at)) {
                logger.log('info', 2)
                return requestController.requestMalUser(username).then((user) => {
                    logger.log('info', 3)
                    user.updatedOrCreated = true
                    return userClient.updateUser(user)
                })
            } else {
                logger.log('info', 4)
                return requestController.requestMalUser(username).then((user) => {
                    logger.log('info', 5)
                    if (user.myanimelist) {
                        user.updatedOrCreated = true
                        return userClient.createUser(user)
                    } else throw returnError.userNotFound()
                })
            }
        })
    } else throw returnError.emptyArgument()
}

module.exports = {
    getUser: handleGettingUser
}
