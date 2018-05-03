'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const logger = require('./logging/index')
const returnError = require('./errors/index')
const exphbs = require('express-handlebars')
require('./database_config/associations').tableRelationships()
// const Handlebars = require('handlebars')
// const hbs = expressHandlebars().create({defaultLayout: 'main'})

// database_config ===============================
app.set('port', (process.env.port || 8000))
app.use(express.static(path.join(__dirname, '/bower_components')))
app.set('views', path.join(__dirname, '/ui/views'))
app.use(express.static(path.join(__dirname, 'ui//public')))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}))
app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir: path.join(__dirname, 'ui/views/layouts')}))
app.set('view engine', 'handlebars')
// Handlebars.registerHelper('raw-helper', (options) => { return options.fn() })

// routes ===============================
const router = require('./routes')
app.use('/', router)

// handler for 404 (page not found)
app.use((request, response, next) => next(returnError.resourceNotFound()))

// handler for sending errors
app.use((error, request, response, next) => {
    if (error) {
        if (error.code) {
            response.status(200).render('index', {status: error.code, error: error.message})
        } else {
            logger.log('error', error)
            error = returnError.unexpectedError()
            response.status(200).render('index', {status: error.code, error: error.message})
        }
    }
})

// launch ===============================
app.listen(app.get('port'), (error) => {
    if (error) logger.log('error', error)
    else logger.log('info', 'App is running, server is listening on port ' + app.get('port'))
})
