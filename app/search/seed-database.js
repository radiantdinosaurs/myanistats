'use strict'

const animeController = require('../anime/index')
const userController = require('../user/index')
const format = require('../format/index')
const associationController = require('../associations/index')

async function handleSeedingDatabase(user, userInformation) {
    const seedDatabase = userInformation.seed
    const defineRelationship = userInformation.define_relationship
    const anime = format.formatAnimeForBulkInsert(userInformation.seed)
    await animeController.bulkInsert(anime)

    const userAnimeBulk = await format.formatUserAnimeForBulkInsert(user.dataValues.id, seedDatabase, user.malData)
    userController.bulkInsertUserAnimeRelationship(userAnimeBulk)

    let genreQuery = 'INSERT INTO `anime_genre` (fk_anime_id_anime_genre, fk_genre_id) VALUES'
    const genreList = format.formatAssociationsForBulkInsert(seedDatabase, genreQuery, 'genre')
    await associationController.bulkInsertGenre(genreList[1])
    associationController.bulkInsertRelationship(genreList[0])

    let studioQuery = 'INSERT INTO `anime_studio` (fk_anime_id_anime_studio, fk_studio_id) VALUES'
    const studioList = format.formatAssociationsForBulkInsert(seedDatabase, studioQuery, 'studio')
    await associationController.bulkInsertStudio(studioList[1])
    associationController.bulkInsertRelationship(studioList[0])

    let licensorQuery = 'INSERT INTO `anime_licensor` (fk_anime_id_anime_licensor, fk_licensor_id) VALUES'
    const licensorList = format.formatAssociationsForBulkInsert(seedDatabase, licensorQuery, 'licensor')
    await associationController.bulkInsertLicensor(licensorList[1])
    associationController.bulkInsertRelationship(licensorList[0])

    let producerQuery = 'INSERT INTO `anime_producer` (fk_anime_id_anime_producer, fk_producer_id) VALUES'
    const producerList = format.formatAssociationsForBulkInsert(seedDatabase, producerQuery, 'producer')
    await associationController.bulkInsertProducer(producerList[1])
    associationController.bulkInsertRelationship(producerList[0])
}

module.exports = {
    handleSeedingDatabase: handleSeedingDatabase
}
