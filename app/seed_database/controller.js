'use strict'

const logger = require('../logging/index')
const returnError = require('../errors/index')
const animeController = require('../anime/index')
const format = require('../format/index')
const associationController = require('../associations/index')
const genreController = require('../genre/index')
const studioController = require('../studio/index')
const licensorController = require('../licensor/index')
const producerController = require('../producer/index')

function seedDatabaseWithAnime(anime) {
    return animeController.bulkInsert(anime)
}

async function seedDatabaseWithUserAssociation(userId, unrecordedAnime, malData) {
    const userAnimeRawQuery = await format.formatUserRelationshipForBulkInsert(userId, unrecordedAnime, malData)
    return associationController.bulkInsertRawQuery(userAnimeRawQuery)
}

async function seedDatabaseWithGenreAssociation(unrecordedAnime) {
    const query = 'INSERT IGNORE INTO `anime_genre` (fk_anime_id_anime_genre, fk_genre_id) VALUES'
    const list = format.formatAssociationsForBulkInsert(unrecordedAnime, query, 'genre')
    await genreController.bulkInsert(list[1])
    return associationController.bulkInsertRawQuery(list[0])
}

async function seedDatabaseWithStudioAssociation(unrecordedAnime) {
    const query = 'INSERT IGNORE INTO `anime_studio` (fk_anime_id_anime_studio, fk_studio_id) VALUES'
    const list = format.formatAssociationsForBulkInsert(unrecordedAnime, query, 'studio')
    await studioController.bulkInsert(list[1])
    return associationController.bulkInsertRawQuery(list[0])
}

async function seedDatabaseWithLicensorAssociation(unrecordedAnime) {
    const query = 'INSERT IGNORE INTO `anime_licensor` (fk_anime_id_anime_licensor, fk_licensor_id) VALUES'
    const list = format.formatAssociationsForBulkInsert(unrecordedAnime, query, 'licensor')
    await licensorController.bulkInsert(list[1])
    return associationController.bulkInsertRawQuery(list[0])
}

async function seedDatabaseWithProducerAssociation(unrecordedAnime) {
    const query = 'INSERT IGNORE INTO `anime_producer` (fk_anime_id_anime_producer, fk_producer_id) VALUES'
    const list = format.formatAssociationsForBulkInsert(unrecordedAnime, query, 'producer')
    await producerController.bulkInsert(list[1])
    return associationController.bulkInsertRawQuery(list[0])
}

async function handleSeedingDatabase(user, userStats) {
    try {
        let unrecordedAnime = userStats.unrecorded_anime
        if (Array.isArray(unrecordedAnime) && unrecordedAnime.length) {
            unrecordedAnime = await format.formatAnimeToSeedDatabaseWith(unrecordedAnime)
            await seedDatabaseWithAnime(unrecordedAnime)
            await seedDatabaseWithGenreAssociation(userStats.unrecorded_anime)
            await seedDatabaseWithStudioAssociation(userStats.unrecorded_anime)
            await seedDatabaseWithLicensorAssociation(userStats.unrecorded_anime)
            await seedDatabaseWithProducerAssociation(userStats.unrecorded_anime)
        }
        await seedDatabaseWithUserAssociation(user.dataValues.id, user.mal_data)
    } catch (exception) {
        logger.log('error', exception)
        throw returnError.unexpectedError()
    }
}

module.exports = {
    handleSeedingDatabase: handleSeedingDatabase
}
