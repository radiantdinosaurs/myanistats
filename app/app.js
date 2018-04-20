'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const logger = require('./logging/index')
const returnError = require('./errors/index')
const exphbs = require('express-handlebars')
// const Handlebars = require('handlebars')
// const hbs = expressHandlebars().create({defaultLayout: 'main'})

// config ===============================
app.set('port', (process.env.port || 8000))
app.use(express.static(path.join(__dirname, '/bower_components'))) // TODO: Same notes here as above, but also look more into Bower
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: false, parameterLimit: 50000}))
app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views/layouts')}))
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
