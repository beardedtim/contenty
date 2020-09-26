const { Router } = require('express')
const middleware = require('../server/middleware')
const UseCases = require('../use-cases')
const db = require('../infrastructure/db')
const HTTPErrors = require('../errors/http')

const Dynamic = Router()

Dynamic.get(
  '/:slug',
  middleware.route(async (req, res) => {
    const query = {
      limit: req.query.limit || 100,
      offset: req.query.offset || 0,
      sort_col: req.query.sort_col || 'id',
      sort_ord: req.query.sort_ord || 'ASC',
      where: {},
    }

    const data = await UseCases.Dynamic.list(req.params.slug, query, db)

    res.json({ data })
  })
)
  .post(
    '/:slug',
    middleware.route(async (req, res) => {
      const { body } = req

      const data = await UseCases.Dynamic.create(req.params.slug, body, db)

      res.status(201).json({ data })
    })
  )
  .get(
    '/:slug/:id',
    middleware.route(async (req, res) => {
      const data = await UseCases.Dynamic.getById(req.params.id, db)

      if (!data) {
        throw new HTTPErrors.ResourceNotFound(
          `${req.params.slug}::ID::${req.params.id}`
        )
      }

      res.json({ data })
    })
  )
  .patch(
    '/:slug/:id',
    middleware.route(async (req, res) => {
      const data = await UseCases.Dynamic.updateById(
        req.params.id,
        req.body,
        db
      )

      res.json({ data })
    })
  )
  .delete(
    '/:slug/:id',
    middleware.route(async (req, res) => {
      const data = await UseCases.Dynamic.deleteById(req.params.id, db)

      res.json({ data })
    })
  )

module.exports = Dynamic
