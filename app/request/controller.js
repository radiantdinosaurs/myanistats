'use strict'

const request = require('request')
const logger = require('../logging/index')
const returnError = require('../errors/index')
const parseString = require('xml2js').parseString

function requestMyAnimeListUser(username) {
    return new Promise((resolve, reject) => {
        const url = 'http://myanimelist.net/malappinfo.php?u=' + username + '&status=all&type=anime'
        request(url, (error, response, body) => {
            if (error) {
                logger.log('error', error)
                reject(returnError.problemRequestingMyAnimeListUser())
            } else {
                parseString(body, (error, result) => {
                    if (error) {
                        reject(returnError.unexpectedError())
                    }
                    resolve(result)
                })
            }
        })
    })
}

module.exports = {
    requestMyAnimeListUser: requestMyAnimeListUser
}
