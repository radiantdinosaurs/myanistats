'use strict'

const controller = require('./controller')

module.exports = {
    findAnimeById: controller.findAnimeById,
    bulkInsertAnime: controller.bulkInsertAnime,
    bulkInsertGenre: controller.insertGenre,
    findall: controller.findall,
    insertGenre1: controller.insertGenre1
}
