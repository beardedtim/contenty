const { Router } = require('express')
const slugify = require('@sindresorhus/slugify')
const Joi = require('joi')
const db = require('../infrastructure/db')
const middleware = require('../server/middleware')
const UseCases = require('../use-cases')
const HTTPErrors = require('../errors/http')

const createCollectionSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().optional(),
})

const updateCollectionSchema = Joi.object({
  name: Joi.string().optional(),
  slug: Joi.string().optional(),
})

const Collections = Router()

Collections.post(
  '/',
  middleware.validateBody(createCollectionSchema),
  middleware.route(async (req, res) => {
    const { body } = req

    if (!body.slug) {
      body.slug = slugify(body.name)
    }

    body.slug = slugify(body.slug)

    const data = await UseCases.Collections.create(body, db)

    res.status(201).json({ data })
  })
)
  .get(
    '/',
    middleware.route(async (req, res) => {
      const query = {
        limit: req.query.limit || 100,
        offset: req.query.offset || 0,
        sort_col: req.query.sort_col || 'name',
        sort_ord: req.query.sort_ord || 'ASC',
        where: {},
      }

      const data = await UseCases.Collections.list(query, db)

      res.json({ data })
    })
  )
  .get(
    '/:id',
    middleware.route(async (req, res) => {
      const data = await UseCases.Collections.getById(req.params.id, db)

      if (!data) {
        throw new HTTPErrors.ResourceNotFound(
          `Collection::ID::${req.params.id}`
        )
      }

      res.json({ data })
    })
  )
  .patch(
    '/:id',
    middleware.validateBody(updateCollectionSchema),
    middleware.route(async (req, res) => {
      const { body } = req

      if (body.slug) {
        body.slug = slugify(body.slug)
      }

      const data = await UseCases.Collections.updateById(
        req.params.id,
        req.body,
        db
      )

      res.status(201).json({ data })
    })
  )
  .delete(
    '/:id',
    middleware.route(async (req, res) => {
      const data = await UseCases.Collections.delete(req.params.id, db)

      res.status(200).json({ data })
    })
  )

module.exports = Collections
