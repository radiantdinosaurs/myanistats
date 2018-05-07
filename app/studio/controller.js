'use strict'

const Studio = require('./studio')

function bulkInsert(studio) {
    return Studio.bulkCreate(studio, {ignoreDuplicates: true}).then((result) => result)
}

module.exports = {
    bulkInsert: bulkInsert
}
