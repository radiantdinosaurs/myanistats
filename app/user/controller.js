'use strict'

const User = require('./user')
const returnError = require('../errors/index')

/**
 * Finds one User instance through username
 * @param username - name of user
 * @returns {*} - array of User instance or null
 */
function findOneUserByUsername(username) {
    if (username) {
        const whereParameters = {name: username}
        const attributesParameters = [
            'id',
            'name',
            'watching',
            'completed',
            'on_hold',
            'dropped',
            'plan_to_watch',
            'days_spent_watching',
            'updated_at']
        return User.findOne({where: whereParameters, attributes: attributesParameters}).then((user) => user)
    } else returnError.emptyArgument()
}

/**
 * Finds or creates an User instance
 * @param malUserData - array of user information (e.g., ID, watching, completed, etc.)
 * @returns {*} - array of User instance
 */
function findOrCreateUser(malUserData) {
    if (malUserData) {
        const userInformation = malUserData.myanimelist.myinfo[0]
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
        return User.findOrCreate({where: whereParameters, defaults: defaultParameters}).spread((user, created) => user)
    } else returnError.emptyArgument()
}

/**
 * Updates a User instance in the database
 * @param malUserData - user information (e.g., username, ID, etc.)
 * @returns {*} - array of User instance
 */
function updateUser(malUserData) {
    if (malUserData) {
        const userInformation = malUserData.myanimelist.myinfo[0]
        malUserData = {
            id: userInformation.user_id[0],
            name: userInformation.user_name[0],
            watching: userInformation.user_watching[0],
            completed: userInformation.user_completed[0],
            on_hold: userInformation.user_onhold[0],
            dropped: userInformation.user_dropped[0],
            plan_to_watch: userInformation.user_plantowatch[0],
            days_spent_watching: userInformation.user_days_spent_watching[0]
        }
        const whereParameters = {id: malUserData.id}
        return User.update(malUserData, {where: whereParameters}).then(() => findOneUserByUsername(malUserData.name))
    } else returnError.emptyArgument()
}

module.exports = {
    findOrCreateUser: findOrCreateUser,
    updateUser: updateUser
}
