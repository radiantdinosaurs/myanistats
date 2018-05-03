'use strict'

const returnError = require('../errors/index')
const requestController = require('../request/index')
const userController = require('../user/index')
const logger = require('../logging/index')
const format = require('../format/index')
const animeController = require('../anime/index')

function recordNeedsUpdating(userLastUpdated) {
    const currentDate = new Date()
    const timeDifference = Math.abs(currentDate.getTime() - userLastUpdated.getTime())
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24))
    return true // !dayDifference <= 5 // TODO: Don't forget to switch this around
}

async function handleGettingUser(username) {
    if (username) {
        let user
        let malUserData
        try {
            user = await userController.findOneByUsername(username)
            if (user && !recordNeedsUpdating(user.dataValues.updated_at)) {
                user.updatedOrCreated = false
                return new Promise((resolve) => resolve(user))
            } else if (user && recordNeedsUpdating(user.dataValues.updated_at)) {
                malUserData = await requestController.requestMalUser(username)
                user = await userController.update(malUserData)
                user.updatedOrCreated = true
                user.malData = await malUserData
                return new Promise((resolve) => resolve(user))
            } else {
                malUserData = await requestController.requestMalUser(username)
                if (malUserData.myanimelist) {
                    user = await userController.findOrCreate(malUserData)
                    user.updatedOrCreated = true
                    user.malData = malUserData
                    return new Promise((resolve) => resolve(user[0]))
                } else return new Promise((resolve, reject) => reject(returnError.userNotFound()))
            }
        } catch (exception) {
            logger.log('error', exception)
            throw returnError.unexpectedError()
        }
    } else throw returnError.emptyArgument()
}

async function handleNewUser(user) {
    let malData = user.malData
    let animeFoundInDb
    let animeId
    let animeFromJikan
    let userInformation = {}
    try {
        animeId = await format.objectToSet(malData.myanimelist.anime) // make a set of only the anime ID
        animeFoundInDb = await animeController.findAllById(Array.from(animeId), user) // query the DB with the set
        await format.removeFromSet(animeId, animeFoundInDb) // remove found anime from the set
        animeFromJikan = await requestController.handleMakingBulkJikanRequests(animeId) // get missing anime from Jikan
        userInformation.user_information = format.compileDataForResponse(animeFoundInDb, animeFromJikan, malData)
        userInformation.seed = animeFromJikan
        userInformation.define_relationship = animeFoundInDb
        return new Promise((resolve) => resolve(userInformation))
    } catch (exception) {
        logger.log('error', exception)
        return new Promise((resolve, reject) => reject(returnError.unexpectedError()))
    }
}

module.exports = {
    getUser: handleGettingUser,
    handleNewOrUpdatedUser: handleNewUser
}
