'use strict'

const { body } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

const validateSearchForm = [
    body('user').trim().isLength({ min: 1 }).withMessage('Username must be specified'),
    sanitizeBody('user').trim().escape()
]

module.exports.validateSearchForm = validateSearchForm
