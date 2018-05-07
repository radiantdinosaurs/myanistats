'use strict'

const sequelize = require('../../config/database')

function bulkInsertRawQuery(list) {
    return sequelize.query(list)
}

module.exports = {
    bulkRawQuery: bulkInsertRawQuery
}
