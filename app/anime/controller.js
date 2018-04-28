'use strict'

const Anime = require('./anime')

function findAnimeById(animeId) {
    const attributesParameters = ['id', 'title', 'link_canonical', 'image_url', 'type', 'episodes', 'aired_string',
        'duration', 'rating', 'score', 'scored_by', 'rank', 'synopsis', 'background', 'premiered']
    const whereParameters = {id: animeId}
    return Anime.findAll({attributes: attributesParameters, where: whereParameters}).then((anime) => {
        return anime
    })
}

function bulkInsertAnime(animeList) {
    return Anime.bulkCreate(animeList).then((anime) => {
        return anime
    })
}

module.exports = {
    findAnimeById: findAnimeById,
    bulkInsertAnime: bulkInsertAnime
}
