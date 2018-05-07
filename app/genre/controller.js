'use strict'

const Genre = require('./genre')

function bulkInsert(genre) {
    return Genre.bulkCreate(genre, {ignoreDuplicates: true}).then((genre) => genre)
}

module.exports = {
    bulkInsert: bulkInsert
}
