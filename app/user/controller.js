'use strict'

const User = require('./user')
const sequelize = require('../database_config/connection')

/**
 * Finds one User through username
 * @param username - name of user
 * @returns {*} - array of User instance
 */
function findOneByUsername(username) {
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
}

/**
 * Finds or creates a User instance
 * @param user - array of user information
 * @returns {*} - array of User instance
 */
function findOrCreate(user) {
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
    return User.findOrCreate({where: whereParameters, defaults: defaultParameters}).then((user) => user)
}

/**
 * Updates a User in the database
 * @param user - user information (e.g., username, ID, etc.)
 * @returns {*} - array of User instance
 */
function update(user) {
    const userInformation = user.myanimelist.myinfo[0]
    user = {
        id: userInformation.user_id[0],
        name: userInformation.user_name[0],
        watching: userInformation.user_watching[0],
        completed: userInformation.user_completed[0],
        on_hold: userInformation.user_onhold[0],
        dropped: userInformation.user_dropped[0],
        plan_to_watch: userInformation.user_plantowatch[0],
        days_spent_watching: userInformation.user_days_spent_watching[0]
    }
    const whereParameters = {id: user.id}
    return User.update(user, {where: whereParameters}).then(() => findOneByUsername(user.name))
}

function bulkInsertUserAnimeRelationship(userAnime) {
    sequelize.query(userAnime).spread((results, metadata) => {
    }).catch((error) => console.log(error))
}

module.exports = {
    findOneByUsername: findOneByUsername,
    findOrCreate: findOrCreate,
    update: update,
    bulkInsertUserAnimeRelationship: bulkInsertUserAnimeRelationship
}
