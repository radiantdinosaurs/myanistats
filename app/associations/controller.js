'use strict'

const sequelize = require('../database_config/connection')
const Studio = require('./studio')
const Genre = require('./genre')
const Licensor = require('./licensor')
const Producer = require('./producer')

function bulkInsertRelationship(list) {
    sequelize.query(list).spread((results, metadata) => {
    })
}

function bulkInsertStudio(studio) {
    return Studio.bulkCreate(studio, {ignoreDuplicates: true}).then((result) => result)
}

function bulkInsertGenre(genre) {
    return Genre.bulkCreate(genre, {ignoreDuplicates: true}).then((genre) => genre)
}

function bulkInsertLicensor(licensor) {
    return Licensor.bulkCreate(licensor, {ignoreDuplicates: true}).then((licensor) => licensor)
}

function bulkInsertProducer(producer) {
    return Producer.bulkCreate(producer, {ignoreDuplicates: true}).then((producer) => producer)
}

module.exports = {
    bulkInsertRelationship: bulkInsertRelationship,
    bulkInsertGenre: bulkInsertGenre,
    bulkInsertStudio: bulkInsertStudio,
    bulkInsertLicensor: bulkInsertLicensor,
    bulkInsertProducer: bulkInsertProducer
}
