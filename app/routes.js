'use strict'

const express = require('express')
const router = express.Router()
const index = require('./controllers/indexController')

router.get('/', (request, response) => {
    response.status(200).render('index', {title: 'MyAnimeStats'})
})
router.post('/', index.post_user)

module.exports = router
