'use strict'

const User = require('../models/user')
const returnError = require('../errors/index')
const logger = require('../logging/index')
const requestController = require('../request/index')

function findUserByUsername(username) {
    const whereParameters = {name: username}
    const attributesParameters = ['id', 'name', 'watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch',
        'days_spent_watching', 'updated_at']
    return User.findOne({where: whereParameters, attributes: attributesParameters}).then((user) => {
        if (user) return user
        else return null
    })
}

function createUser(user) {
    const userInformation = user.myanimelist.myinfo[0]
    const whereParameters = {id: userInformation.user_id[0]}
    const defaultParameters = {
        id: userInformation.user_id[0],
        name: userInformation.user_name[0],
        watching: userInformation.user_watching[0],
        completed: userInformation.user_completed[0],
        on_hold: userInformation.user_onhold[0],
        dropped: userInformation.user_dropped[0],
        plan_to_watch: userInformation.user_plantowatch[0],
        days_spent_watching: userInformation.user_days_spent_watching[0]
    }
    return User.findOrCreate({
        where: whereParameters,
        defaults: defaultParameters
    }).then((user) => {
        user.updatedOrCreated = true
        return user
    })
}

function updateUser(user) {
    const userInformation = user.myanimelist.myinfo[0]
    const recordParameters = {
        id: userInformation.user_id[0],
        name: userInformation.user_name[0],
        watching: userInformation.user_watching[0],
        completed: userInformation.user_completed[0],
        on_hold: userInformation.user_onhold[0],
        dropped: userInformation.user_dropped[0],
        plan_to_watch: userInformation.user_plantowatch[0],
        days_spent_watching: userInformation.user_days_spent_watching[0]
    }
    const whereParameters = {id: userInformation.user_id[0]}
    User.update(recordParameters, {where: whereParameters}).then((user) => {
        user.updatedOrCreated = true
        return user
    })
}

function recordNeedsUpdating(userLastUpdated) {
    const currentDate = new Date()
    const timeDifference = Math.abs(currentDate.getTime() - userLastUpdated.getTime())
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24))
    if (dayDifference <= 5) {
        logger.log('info', 'Doesnt need to be updated')
        return false
    } else return true
}

function handleGettingUser(username) {
    return findUserByUsername(username).then((user) => {
        if (user && !recordNeedsUpdating(user.dataValues.updated_at)) {
            user.updatedOrCreated = false
            return user
        } else if (user && recordNeedsUpdating(user.dataValues.updated_at)) {
            return requestController.requestMyAnimeListUser(username).then((user) => {
                return updateUser(user)
            })
        } else {
            return requestController.requestMyAnimeListUser(username).then((user) => {
                return createUser(user)
            })
        }
    })
}

module.exports = {
    getUser: handleGettingUser
}
