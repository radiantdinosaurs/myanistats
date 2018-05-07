'use strict'

const returnError = require('../errors/index')

function malListToSet(malList) {
    if (malList) {
        const set = new Set()
        for (let i = 0; i < malList.length; i++) {
            const parameter = Number(malList[i].series_animedb_id[0])
            set.add(parameter)
        }
        return set
    } else throw returnError.emptyArgument()
}

function removeAnimeIdFromSet(animeIdSet, listOfAnimeToRemove) {
    if (animeIdSet && listOfAnimeToRemove) {
        for (let i = 0; i < listOfAnimeToRemove.length; i++) {
            if (animeIdSet.has(listOfAnimeToRemove[i].dataValues.id)) {
                animeIdSet.delete(listOfAnimeToRemove[i].dataValues.id)
            }
        }
    } else throw returnError.emptyArgument()
}

function compileUserStats(animeFoundInDb, unrecordedAnime, malUserData) {
    if (animeFoundInDb && unrecordedAnime && malUserData) {
        const compiledStats = {}
        const meanScore = getMeanScore(malUserData).toFixed(2)
        const userData = {
            name: malUserData.myanimelist.myinfo[0].user_name[0],
            id: malUserData.myanimelist.myinfo[0].user_id[0],
            watching: malUserData.myanimelist.myinfo[0].user_watching[0],
            completed: malUserData.myanimelist.myinfo[0].user_completed[0],
            on_hold: malUserData.myanimelist.myinfo[0].user_onhold[0],
            dropped: malUserData.myanimelist.myinfo[0].user_dropped[0],
            plan_to_watch: malUserData.myanimelist.myinfo[0].user_plantowatch[0],
            days_spent_watching: malUserData.myanimelist.myinfo[0].user_days_spent_watching[0],
            mean_score: meanScore
        }
        const user_data = {
            premiered: {},
            source: {},
            genre: {}
        }
        handleCompilingStats(animeFoundInDb, unrecordedAnime, user_data)
        user_data.watching_stats = userData
        compiledStats.mal_anime = malUserData
        compiledStats.unrecorded_anime = unrecordedAnime
        compiledStats.anime_found_in_db = animeFoundInDb
        return compiledStats
    } else throw returnError.emptyArgument()
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

function handleCompilingStats(animeFoundInDb, unrecordedAnime, stats) {
    getCompiledStatsFromAnimeFoundInDb(animeFoundInDb, stats)
    getCompiledStatsFromUnrecordedAnime(unrecordedAnime, stats)
    return stats
}

function getCompiledStatsFromAnimeFoundInDb(animeFoundInDb, stats) {
    for (let i = 0; i < animeFoundInDb.length; i++) {
        if (animeFoundInDb[i].dataValues.premiered) {
            if (stats.premiered && stats.premiered.hasOwnProperty(animeFoundInDb[i].dataValues.premiered)) {
                stats.premiered[animeFoundInDb[i].dataValues.premiered] += 1
            } else if (stats.premiered) stats.premiered[animeFoundInDb[i].dataValues.premiered] = 1
        }
        if (stats.source.hasOwnProperty(animeFoundInDb[i].dataValues.source)) {
            stats.source[animeFoundInDb[i].dataValues.source] += 1
        } else stats.source[animeFoundInDb[i].dataValues.source] = 1
        for (let j = 0; j < animeFoundInDb[i].dataValues.genres.length; j++) {
            if (stats.genre.hasOwnProperty(animeFoundInDb[i].dataValues.genres[j].dataValues.name)) {
                stats.genre[animeFoundInDb[i].dataValues.genres[j].dataValues.name] += 1
            } else stats.genre[animeFoundInDb[i].dataValues.genres[j].dataValues.name] = 1
        }
    }
    return stats
}

function getCompiledStatsFromUnrecordedAnime(unrecordedAnime, stats) {
    for (let i = 0; i < unrecordedAnime.length; i++) {
        if (stats.premiered && stats.premiered.hasOwnProperty(unrecordedAnime[i].premiered)) {
            stats.premiered[unrecordedAnime[i].premiered] += 1
        } else if (stats.premiered) stats.premiered[unrecordedAnime[i].premiered] = 1
        if (stats.source.hasOwnProperty(unrecordedAnime[i].source)) {
            stats.source[unrecordedAnime[i].source] += 1
        } else stats.source[unrecordedAnime[i].source] = 1
        if (unrecordedAnime[i].genre) {
            for (let j = 0; j < unrecordedAnime[i].genre.length; j++) {
                if (stats.genre.hasOwnProperty(unrecordedAnime[i].genre[j].name)) {
                    stats.genre[unrecordedAnime[i].genre[j].name] += 1
                } else stats.genre[unrecordedAnime[i].genre[j].name] = 1
            }
        }
    }
    return stats
}

function formatAnimeForBulkInsert(unrecordedAnime) {
    return new Promise((resolve, reject) => {
        const formatted = []
        for (let i = 0; i < unrecordedAnime.length; i++) {
            let animeData = {
                id: unrecordedAnime[i].mal_id,
                title: String(unrecordedAnime[i].title),
                link_canonical: String(unrecordedAnime[i].link_canonical),
                image_url: String(unrecordedAnime[i].image_url),
                type: unrecordedAnime[i].type,
                source: unrecordedAnime[i].source,
                episodes: unrecordedAnime[i].episodes,
                aired_string: unrecordedAnime[i].aired_string,
                duration: unrecordedAnime[i].duration,
                rating: unrecordedAnime[i].rating,
                score: unrecordedAnime[i].score,
                scored_by: unrecordedAnime[i].scored_by,
                rank: unrecordedAnime[i].rank,
                synopsis: unrecordedAnime[i].synopsis,
                background: unrecordedAnime[i].background,
                premiered: unrecordedAnime[i].premiered
            }
            formatted.push(animeData)
        }
        resolve(formatted)
    })
}

function formatUserRelationshipForBulkInsert(userId, malData) {
    return new Promise((resolve, reject) => {
        let string = 'INSERT IGNORE INTO `user_anime` (fk_anime_id_user_anime, fk_user_id_user_anime, my_watched_episodes, my_start_date,' +
            ' my_finish_date, my_score, my_status, my_rewatching, my_rewatching_episodes) VALUES '
        for (let i = 0; i < malData.myanimelist.anime.length; i++) {
            let watchingInfo = {
                my_watched_episodes: malData.myanimelist.anime[i].my_watched_episodes[0],
                my_start_date: (malData.myanimelist.anime[i].my_start_date[0] === '0000-00-00') ? null : '\'' + malData.myanimelist.anime[i].my_start_date[0] + '\'',
                my_finish_date: (malData.myanimelist.anime[i].my_finish_date[0] === '0000-00-00') ? null : '\'' + (malData.myanimelist.anime[i].my_finish_date[0]) + '\'',
                my_score: malData.myanimelist.anime[i].my_score[0],
                my_status: malData.myanimelist.anime[i].my_status[0],
                my_rewatching: malData.myanimelist.anime[i].my_rewatching[0],
                my_rewatching_episodes: malData.myanimelist.anime[i].my_rewatching_ep[0]
            }
            // const watchingInfo = malMap.get(Number(malData.myanimelist.anime[i].series_animedb_id))
            string += '(' + malData.myanimelist.anime[i].series_animedb_id + ',' + userId + ',' + Number(watchingInfo.my_watched_episodes) + ',' + watchingInfo.my_start_date +
                ',' + watchingInfo.my_finish_date + ',' + Number(watchingInfo.my_score) + ',' + Number(watchingInfo.my_status) + ',' +
                Number(watchingInfo.my_rewatching) + ',' + Number(watchingInfo.my_rewatching_episodes) + '),'
        }
        resolve(string.substring(0, string.length - 1))
    })
}

function formatAssociationsForBulkInsert(unrecordedAnime, databaseQuery, parameter) {
    const genreArray = []
    const genreSet = new Set()
    const quotationMark = String.raw`'`
    for (let i = 0; i < unrecordedAnime.length; i++) {
        for (let j = 0; j < unrecordedAnime[i][parameter].length; j++) {
            genreSet.add(unrecordedAnime[i][parameter][j].name)
            databaseQuery += '(' + unrecordedAnime[i].mal_id + ',' + quotationMark + unrecordedAnime[i][parameter][j].name + quotationMark + '),'
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
    removeAnimeIdFromSet: removeAnimeIdFromSet,
    malListToSet: malListToSet,
    compileUserStats: compileUserStats,
    formatAnimeToSeedDatabaseWith: formatAnimeForBulkInsert,
    formatUserRelationshipForBulkInsert: formatUserRelationshipForBulkInsert,
    formatAssociationsForBulkInsert: formatAssociationsForBulkInsert
}
