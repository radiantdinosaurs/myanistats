'use strict'

const logger = require('../logging/index')
const requestController = require('../request/index')
const userController = require('../user/index')
const animeController = require('../anime/index')
const seedDatabase = require('../seed_database/controller')
const returnError = require('../errors/index')
const format = require('../format/index')
const validate = require('../security/validator')
const validationResult = require('express-validator/check').validationResult

function postUsernameSearch(request, response, next) {
    const username = request.body.user
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        response.status(200).render('index', {errors: errors.array()}) // TODO: Front-end error rendering
    } else {
        handleGettingUser(username).then((user) => {
            handleGettingNewUserStats(user).then((userStats) => {
                response.status(200).send(userStats)
                seedDatabase.handleSeedingDatabase(user, userStats).catch((error) => logger.log('error', error))
                // TODO: Make seperate handling for new vs. old users with `user._options.isNewRecord`
            }).catch((error) => {
                logger.log('error', error)
            })
        }).catch((error) => {
            logger.log('error', error)
            next(error)
        })
    }
}

const handlePostSearch = [
    validate.validateSearchForm,
    postUsernameSearch
]

async function handleGettingUser(username) {
    try {
        let malUserData = await requestController.requestMalUser(username)
        let user = await userController.findOrCreateUser(malUserData)
        if (!user._options.isNewRecord) {
            user = await userController.updateUser(malUserData)
        }
        user.mal_data = malUserData
        return new Promise((resolve) => resolve(user))
    } catch (exception) {
        logger.log('error', exception)
        if (exception.code && exception.code === 400) throw exception
        else throw returnError.unexpectedError()
    }
}

async function handleGettingNewUserStats(user) {
    try {
        const malUserData = user.mal_data
        const animeIdSet = await format.malListToSet(malUserData.myanimelist.anime)
        const animeFoundInDb = await animeController.findAllById(Array.from(animeIdSet), user)
        await format.removeAnimeIdFromSet(animeIdSet, animeFoundInDb)
        const unrecordedAnime = await requestController.handleMakingBulkJikanRequests(animeIdSet)
        const userStats = format.compileUserStats(animeFoundInDb, unrecordedAnime, malUserData)
        return new Promise((resolve) => resolve(userStats))
    } catch (exception) {
        logger.log('error', exception)
        throw returnError.unexpectedError()
    }
}

module.exports = {
    handlePostSearch: handlePostSearch
}
