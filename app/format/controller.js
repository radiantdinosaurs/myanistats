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

function compileDataForResponse(animeFoundInDb, animeFromJikan, malData) {
    const meanScore = getMeanScore(malData).toFixed(2)
    const userInformation = {
        name: malData.myanimelist.myinfo[0].user_name[0],
        id: malData.myanimelist.myinfo[0].user_id[0],
        watching: malData.myanimelist.myinfo[0].user_watching[0],
        completed: malData.myanimelist.myinfo[0].user_completed[0],
        on_hold: malData.myanimelist.myinfo[0].user_onhold[0],
        dropped: malData.myanimelist.myinfo[0].user_dropped[0],
        plan_to_watch: malData.myanimelist.myinfo[0].user_plantowatch[0],
        days_spent_watching: malData.myanimelist.myinfo[0].user_days_spent_watching[0],
        mean_score: meanScore
    }
    const data = {}
    data.genres = handleMakingGenreList(animeFoundInDb, animeFromJikan)
    data.premiered = handleMakingPremieredList(animeFoundInDb, animeFromJikan)
    data.source = handleMakingSourceList(animeFoundInDb, animeFromJikan)
    data.user_information = userInformation
    return data
}

function handleMakingPremieredList(animeFromDb, animeFromJikan) {
    const premieredList = {}
    getPremieredFromAnimeObject(animeFromDb, premieredList)
    getPremieredFromJikanAnime(animeFromJikan, premieredList)
    return premieredList
}

function getPremieredFromAnimeObject(list, object) {
    for (let i = 0; i < list.length; i++) {
        if (object.hasOwnProperty(list[i].dataValues.premiered)) {
            object[list[i].dataValues.premiered] += 1
        } else {
            object[list[i].dataValues.premiered] = 1
        }
    }
}

function getPremieredFromJikanAnime(list, object) {
    for (let i = 0; i < list.length; i++) {
        if (object.hasOwnProperty(list[i].premiered)) {
            object[list[i].premiered] += 1
        } else {
            object[list[i].premiered] = 1
        }
    }
}

function handleMakingSourceList(animeFromDb, animeFromJikan) {
    const sourceList = {}
    getSourceFromAnimeObject(animeFromDb, sourceList)
    getSourceFromJikanAnime(animeFromJikan, sourceList)
    return sourceList
}

function getSourceFromAnimeObject(list, object) {
    for (let i = 0; i < list.length; i++) {
        if (object.hasOwnProperty(list[i].dataValues.source)) {
            object[list[i].dataValues.source] += 1
        } else {
            object[list[i].dataValues.source] = 1
        }
    }
}

function getSourceFromJikanAnime(list, object) {
    for (let i = 0; i < list.length; i++) {
        if (object.hasOwnProperty(list[i].source)) {
            object[list[i].source] += 1
        } else {
            object[list[i].source] = 1
        }
    }
}

function handleMakingGenreList(animeFromDb, animeFromJikan) {
    const genreObject = {}
    getGenreListFromAnimeObject(animeFromDb, genreObject)
    getGenreListFromJikanAnime(animeFromJikan, genreObject)
    return genreObject
}

function getGenreListFromAnimeObject(list, genreObject) {
    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].dataValues.genres.length; j++) {
            if (genreObject.hasOwnProperty((list[i].dataValues.genres[j].dataValues.name))) {
                genreObject[list[i].dataValues.genres[j].dataValues.name] += 1
            } else {
                genreObject[list[i].dataValues.genres[j].dataValues.name] = 1
            }
        }
    }
    return genreObject
}

function getGenreListFromJikanAnime(list, genreObject) {
    console.log(list.length)
    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].genre.length; j++) {
            if (genreObject.hasOwnProperty(list[i].genre[j].name)) {
                genreObject[list[i].genre[j].name] += 1
            } else {
                genreObject[list[i].genre[j].name] = 1
            }
        }
    }
    return genreObject
}

function getMeanScore(malData) {
    let mean = 0
    let numberRated = 0
    for (let i = 0; i < malData.myanimelist.anime.length; i++) {
        let myScore = Number(malData.myanimelist.anime[i].my_score[0])
        if (myScore > 0) {
            numberRated++
            mean += Number(malData.myanimelist.anime[i].my_score[0])
        }
    }
    return mean / numberRated
}

function formatAnimeForBulkInsert(list) {
    let formattedList = []
    for (let i = 0; i < list.length; i++) {
        let anime = {
            id: list[i].mal_id,
            title: String(list[i].title),
            link_canonical: String(list[i].link_canonical),
            image_url: String(list[i].image_url),
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

function formatUserAnimeForBulkInsert(userId, jikanList, malData) {
    const malMap = makeMalMap(malData.myanimelist.anime)
    let string = 'INSERT INTO `user_anime` (fk_anime_id_user_anime, fk_user_id_user_anime, my_watched_episodes, my_start_date,' +
        ' my_finish_date, my_score, my_status, my_rewatching, my_rewatching_episodes) VALUES '
    for (let i = 0; i < jikanList.length; i++) {
        const watchingInfo = malMap.get(Number(jikanList[i].mal_id))
        let bit = '(' + jikanList[i].mal_id + ',' + userId + ',' + Number(watchingInfo.my_watched_episodes) + ',' + watchingInfo.my_start_date +
            ',' + watchingInfo.my_finish_date + ',' + Number(watchingInfo.my_score) + ',' + Number(watchingInfo.my_status) + ',' +
            Number(watchingInfo.my_rewatching) + ',' + Number(watchingInfo.my_rewatching_episodes) + '),'
        string += bit
    }
    return string.substring(0, string.length - 1)
}

function makeMalMap(malData) {
    const map = new Map()
    for (let i = 0; i < malData.length; i++) {
        let key = Number(malData[i].series_animedb_id[0])
        let values = {
            my_watched_episodes: malData[i].my_watched_episodes[0],
            my_start_date: (malData[i].my_start_date[0] === '0000-00-00') ? null : '\'' + malData[i].my_start_date[0] + '\'',
            my_finish_date: (malData[i].my_finish_date[0] === '0000-00-00') ? null : '\'' + (malData[i].my_finish_date[0]) + '\'',
            my_score: malData[i].my_score[0],
            my_status: malData[i].my_status[0],
            my_rewatching: malData[i].my_rewatching[0],
            my_rewatching_episodes: malData[i].my_rewatching_ep[0]
        }
        map.set(key, values)
    }
    return map
}

function formatAssociationsForBulkInsert(list, databaseQuery, parameter) {
    const genreArray = []
    const genreSet = new Set()
    const quotationMark = String.raw`'`
    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i][parameter].length; j++) {
            genreSet.add(list[i][parameter][j].name)
            databaseQuery += '(' + list[i].mal_id + ',' + quotationMark + list[i][parameter][j].name + quotationMark + '),'
        }
    }
    genreArray.push(databaseQuery.substring(0, databaseQuery.length - 1))
    genreArray.push(setToArray(genreSet))
    return genreArray
}

function setToArray(set) {
    const array = []
    set.forEach((value) => {
        let newValue = {name: value}
        array.push(newValue)
    })
    return array
}

module.exports = {
    removeFromSet: removeFromSet,
    objectToSet: objectToSet,
    handleMakingGenreList: handleMakingGenreList,
    compileDataForResponse: compileDataForResponse,
    formatAnimeForBulkInsert: formatAnimeForBulkInsert,
    formatUserAnimeForBulkInsert: formatUserAnimeForBulkInsert,
    formatAssociationsForBulkInsert: formatAssociationsForBulkInsert
}
