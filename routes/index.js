const { Router } = require('express')
const bodyParser = require('body-parser')

const DB = require('./db')
const Collections = require('./collections')
const DynamicCollections = require('./dynamic-collections')

const Routes = Router()

Routes.use(bodyParser.json())
  .use('/db', DB)
  .use('/collections', Collections)
  .use(DynamicCollections)

module.exports = Routes
