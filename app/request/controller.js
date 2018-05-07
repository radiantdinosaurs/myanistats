'use strict'

const request = require('request')
const logger = require('../logging/index')
const returnError = require('../errors/index')
const parseString = require('xml2js').parseString

function requestMalUser(username) {
    return new Promise((resolve, reject) => {
        const url = 'http://myanimelist.net/malappinfo.php?u=' + username + '&status=all&type=anime'
        request(url, (error, response, body) => {
            if (error) {
                logger.log('error', error)
                reject(returnError.problemRequestingMal())
            } else {
                parseString(body, (error, result) => {
                    if (error) {
                        logger.log('error', error)
                        reject(returnError.unexpectedError())
                    } else if (!result.myanimelist) reject(returnError.userNotFound())
                    else resolve(result)
                })
            }
        })
    })
}

function requestJikanAnime(animeId) {
    return new Promise((resolve, reject) => {
        logger.log('info', 'Making a Jikan request...')
        const TOO_MANY_REQUESTS = 429 // https://jikan.docs.apiary.io/#introduction/information/additional
        const url = 'http://api.jikan.moe/anime/' + animeId
        request(url, (error, response, body) => {
            if (error) {
                logger.log('error', error)
                reject(returnError.problemRequestingJikan())
            } else {
                if (body.error) {
                    logger.log('error', body.error)
                    reject(returnError.problemRequestingJikan())
                } else if (response.statusCode === TOO_MANY_REQUESTS) reject(returnError.jikanLimitReached())
                else resolve(JSON.parse(body))
            }
        })
    })
}

async function handleMakingBulkJikanRequests(animeSet) {
    const promises = []
    animeSet.forEach((animeId) => promises.push(requestJikanAnime(animeId)))
    return Promise.all(promises).then((resolved) => resolved)
}

module.exports = {
    requestMalUser: requestMalUser,
    handleMakingBulkJikanRequests: handleMakingBulkJikanRequests
}
