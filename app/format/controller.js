'use strict'

/**
 * Uses a nested object to make a set of only anime ID
 * @param list - nested object containing a MAL API response (user information, including their anime list)
 * @returns {Set<Number>} - set of anime ID from the nested object
 */
function objectToSet(list) {
    const set = new Set()
    for (let i = 0; i < list.length; i++) {
        const parameter = Number(list[i].series_animedb_id[0])
        set.add(parameter)
    }
    return set
}

/**
 * Removes any number of elements from a set
 * @param set - set of anime ID
 * @param list - list of anime ID to remove from the set
 */
function removeFromSet(set, list) {
    for (let i = 0; i < list.length; i++) {
        if (set.has(list[i].dataValues.id)) {
            set.delete(list[i].dataValues.id)
        }
    }
}

function formatAnimeListForBulkInsert(list) {
    let formattedList = []
    for (let i = 0; i < list.length; i++) {
        let anime = {
            id: list[i].mal_id,
            title: list[i].title,
            link_canonical: list[i].link_canonical,
            image_url: list[i].image_url,
            type: list[i].type,
            source: list[i].source,
            episodes: list[i].episodes,
            aired_string: list[i].aired_string,
            duration: list[i].duration,
            rating: list[i].rating,
            score: list[i].score,
            scored_by: list[i].scored_by,
            rank: list[i].rank,
            synopsis: list[i].synopsis,
            background: list[i].background,
            premiered: list[i].premiered
        }
        formattedList.push(anime)
    }
    return formattedList
}

function formatGenreListForBulkInsert(list) {
    let formattedList = []
    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].genre.length; j++) {
            if (list[i].genre.length) {
                let genre = {
                    fk_anime_id_anime_genre: list[i].mal_id,
                    fk_genre_id: list[i].genre[j].name
                }
                formattedList.push(genre)
            }
        }
    }
    return formattedList
}

function formatLicensorListForBulkInsert(list) {
    let formattedList = []
    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].licensor.length; j++) {
            if (list[i].licensor.length) {
                let licensor = {
                    fk_anime_id_anime_licensor: list[i].mal_id,
                    fk_licensor_id: list[i].licensor[j].name
                }
                formattedList.push(licensor)
            }
        }
    }
    return formattedList
}

function formatProducerListForBulkInsert(list) {
    let formattedList = []
    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].producer.length; j++) {
            if (list[i].producer.length) {
                let producer = {
                    fk_anime_id_anime_producer: list[i].mal_id,
                    fk_producer_id: list[i].producer[j].name
                }
                formattedList.push(producer)
            }
        }
    }
    return formattedList
}

function formatStudioListForBulkInsert(list) {
    let formattedList = []
    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].studio.length; j++) {
            if (list[i].studio.length) {
                let studio = {
                    fk_anime_id_anime_studio: list[i].mal_id,
                    fk_studio_id: list[i].studio[j].name
                }
                formattedList.push(studio)
            }
        }
    }
    return formattedList
}

module.exports = {
    listToSet: objectToSet,
    removeFromSet: removeFromSet,
    formatAnimeListForBulkInsert: formatAnimeListForBulkInsert
}
