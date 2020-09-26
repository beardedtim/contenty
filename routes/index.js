const { Router } = require('express')
const bodyParser = require('body-parser')

const DB = require('./db')
const Collections = require('./collections')

const Routes = Router()

Routes.use(bodyParser.json()).use('/db', DB).use('/collections', Collections)

module.exports = Routes
