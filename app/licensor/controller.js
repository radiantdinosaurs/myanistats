'use strict'

const Licensor = require('./licensor')

function bulkInsert(licensor) {
    return Licensor.bulkCreate(licensor, {ignoreDuplicates: true}).then((licensor) => licensor)
}

module.exports = {
    bulkInsert: bulkInsert
}
