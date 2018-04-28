'use strict'

const User = require('./user')

function findUserByUsername(username) {
    const whereParameters = {name: username}
    const attributesParameters = ['id', 'name', 'watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch',
        'days_spent_watching', 'updated_at']
    return User.findOne({where: whereParameters, attributes: attributesParameters}).then((user) => {
        return user
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
    return User.update(recordParameters, {where: whereParameters}).then((user) => {
        return user
    })
}

module.exports = {
    findUserByUsername: findUserByUsername,
    createUser: createUser,
    updateUser: updateUser
}
