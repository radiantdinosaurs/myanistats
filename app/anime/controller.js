'use strict'

const Anime = require('./anime')
const User = require('../user/user')
const Genre = require('../associations/genre')

/**
 * Finds all Anime through ID, including their associated genres
 * @param animeId - array list of all Anime ID
 * @returns {*} - array of all found Anime instances
 */
function findAllById(animeId) {
    const attributesParameters = [
        'id',
        'title',
        'link_canonical',
        'image_url',
        'type',
        'source',
        'episodes',
        'aired_string',
        'duration',
        'rating',
        'score',
        'scored_by',
        'rank',
        'synopsis',
        'background',
        'premiered']
    const whereParameters = {id: animeId}
    return Anime.findAll({
        attributes: attributesParameters,
        where: whereParameters,
        include: [{model: Genre}]}).then((anime) => anime)
}

/**
 * Finds all Anime associated with a User
 * @param user - instance of User
 * @returns {*} - array of all found Anime instances
 */
function findAllByUserId(user) {
    const userId = user.dataValues.id
    return Anime.findAll({
        include: [{model: User, where: {id: userId}}]
    }).then((anime) => anime)
}

/**
 * Bulk inserts a list of Anime
 * @param anime - array list of Anime
 * @returns {*} - array of all Anime instances created
 */
function bulkInsert(anime) {
    return Anime.bulkCreate(anime, {ignoreDuplicates: true}).then((anime) => anime)
}

module.exports = {
    findAllById: findAllById,
    bulkInsert: bulkInsert,
    findAllByUserId: findAllByUserId
}

// function findAnimeByIdAndDefineRelationship(animeList, user) {
//     const userId = Number(animeList.series_animedb_id[0])
//     const whereParameters = {id: userId}
//     return Anime.findOrCreate({where: whereParameters}).spread((anime) => {
//         const data = {
//             my_watched_episodes: Number(animeList.my_watched_episodes[0]),
//             my_start_date: Date(animeList.my_start_date[0]),
//             my_finish_date: Date(animeList.my_finish_date[0]),
//             my_score: Number(animeList.my_score[0]),
//             my_status: Number(animeList.my_status[0]),
//             my_rewatching: Number(animeList.my_rewatching[0]),
//             my_rewatching_episodes: animeList.my_rewatching[0]
//         }
//         return user.addAnime(anime, {through: data})
//     })
// }
