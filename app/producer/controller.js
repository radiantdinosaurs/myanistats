'use strict'

const Producer = require('./producer')

function bulkInsert(producer) {
    return Producer.bulkCreate(producer, {ignoreDuplicates: true}).then((producer) => producer)
}

module.exports = {
    bulkInsert: bulkInsert
}
