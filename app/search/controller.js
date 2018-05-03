'use strict'

const logger = require('../logging/index')
const userHandler = require('./user-handler')
const seedDatabase = require('./seed-database')
const validate = require('../security/validator')
const validationResult = require('express-validator/check').validationResult

function postUsernameSearch(request, response, next) {
    const username = request.body.user
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        response.status(200).render('index', {errors: errors.array()}) // TODO: Front-end error rendering
    } else {
        userHandler.getUser(username).then((user) => {
            if (user.updatedOrCreated) {
                userHandler.handleNewOrUpdatedUser(user).then((userInformation) => {
                    // response.status(200).send(userInformation.user_information)
                    seedDatabase.handleSeedingDatabase(user, userInformation).then((result) => {
                    }).catch((error) => console.log(error))
                }).catch((error) => {
                    logger.log('error', error)
                    next(error)
                })
            } else if (!user.updatedOrCreated) {
                //
            }
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

module.exports = {
    handlePostSearch: handlePostSearch
}
