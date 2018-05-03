'use strict'

const express = require('express')
const router = express.Router()
const search = require('./search/index')

router.get('/', (request, response) => {
    response.status(200).render('index', {title: 'MyAnimeStats'})
})
router.post('/', search.handlePostSearch)

module.exports = router
