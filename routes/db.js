const { Router } = require('express')
const db = require('../infrastructure/db')
const middleware = require('../server/middleware')

const DB = Router()

DB.post(
  '/migrate',
  middleware.route(async (req, res) => {
    const data = await db.migrate.latest()

    res.json({ data })
  })
).post(
  '/rollback',
  middleware.route(async (req, res) => {
    const data = await db.migrate.rollback(undefined, req.params.all)

    res.json({ data })
  })
)

module.exports = DB
