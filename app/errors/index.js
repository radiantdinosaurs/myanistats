'use strict'

module.exports = {
    resourceNotFound: () => {
        const error = new Error('Resource not found.')
        error.code = 404
        return error
    },
    unexpectedError: () => {
        const error = new Error('Unexpected error. Please try again. If this issue continues, please report it as an ' +
            'issue.')
        error.code = 500
        return error
    },
    userNotFound: () => {
        const error = new Error('Hmmm...it seems like that username doesn\'t exist on MyAnimeList yet!')
        error.code = 400
        return error
    },
    problemRequestingMyAnimeListUser: () => {
        const error = new Error('We can\'t seem to get in touch with MyAnimeList right now. Please check back later!')
        error.code = 500
        return error
    }
}
