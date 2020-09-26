const { Router } = require('express')
const slugify = require('@sindresorhus/slugify')
const Joi = require('joi')
const db = require('../infrastructure/db')
const middleware = require('../server/middleware')
const UseCases = require('../use-cases')

const createCollectionSchema = Joi.object({
  name: Joi.string().required(),
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

module.exports = Collections
