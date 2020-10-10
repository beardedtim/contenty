const { Router } = require('express')
const R = require('ramda')
const middleware = require('../server/middleware')
const UseCases = require('../use-cases')

const db = require('../infrastructure/db')
const queues = require('../infrastructure/queues')

const HTTPErrors = require('../errors/http')

const Dynamic = Router()

const formatQueryValue = R.identity
const formatQueryKey = (key) => {
  const VALID_KEYS = ['created_at', 'last_updated']

  if (VALID_KEYS.indexOf(key) > -1) {
    return key
  }

  return `data::jsonb->>'${key}'`
}

const formatRelationValue = (value) => {
  let formattedValue = value
  let formattedRelation = 'LIKE'

  const KNOWN_TOKENS = [
    '!' /** NOT */,
    'gte' /** GREATER THAN OR EQUAL TO */,
    'gt' /** GREATER THAN */,
    'lte' /** LESS THAN OR EQUAL TO */,
    'lt' /** LESS THAN */,
    '~' /** ILIKE %value% */,
    'before' /**BEFORE A SPECIFIC DATE */,
    'after' /** AFTER A SPECIFIC DATE */,
  ]

  const TOKEN_MAPPING = {
    '!': 'NOT',
    gte: '>=',
    gt: '>',
    lte: '<=',
    lt: '<',
    '~': 'ILIKE',
    before: '<',
    after: '>',
  }

  const VALUE_MAPPING = {
    ILIKE: (v) => `%${v}%`,
    LIKE: (v) => `%${v}%`,
  }

  // Allow us to also search for known tokens
  // if we must
  const NEGATE = '%%'
  if (formattedValue.indexOf(NEGATE) === 0) {
    formattedValue = formattedValue.slice(NEGATE.length)
  }

  // For all of the tokens I know about
  for (const KNOWN_TOKEN of KNOWN_TOKENS) {
    // See if any of them start with the given token
    if (value.indexOf(KNOWN_TOKEN) === 0) {
      formattedRelation = TOKEN_MAPPING[KNOWN_TOKEN]
      formattedValue = formattedValue.slice(KNOWN_TOKEN.length)
      break
    }
  }

  if (VALUE_MAPPING[formattedRelation]) {
    formattedValue = VALUE_MAPPING[formattedRelation](formattedValue)
  }

  return {
    value: formattedValue,
    relation: formattedRelation,
  }
}

const formatQuery = R.compose(
  R.reduce((a, c) => R.mergeLeft({ [c[0]]: formatRelationValue(c[1]) }, a), {}),
  R.map(([key, value]) => [formatQueryKey(key), formatQueryValue(value)]),
  R.filter(([key]) => {
    const other_keys = ['limit', 'offset', 'sort_col', 'sort_ord']

    if (other_keys.includes(key)) {
      return false
    }

    return true
  }),
  R.toPairs,
  R.prop('query')
)

Dynamic.get(
  '/:slug',
  middleware.route(async (req, res) => {
    const query = {
      limit: req.query.limit || 100,
      offset: req.query.offset || 0,
      sort_col: req.query.sort_col || 'id',
      sort_ord: req.query.sort_ord || 'ASC',
      where: formatQuery(req),
    }

    const data = await UseCases.Dynamic.list(req.params.slug, query, db)

    res.json({ data })
  })
)
  .post(
    '/:slug',
    middleware.route(async (req, res) => {
      const { body } = req
      const events = {
        publish: (...args) => {
          console.dir(args)

          return true
        },
      }

      const data = await UseCases.Dynamic.create(
        req.params.slug,
        body,
        db,
        queues.events
      )

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
        req.params,
        req.body,
        db,
        queues.events
      )

      res.json({ data })
    })
  )
  .delete(
    '/:slug/:id',
    middleware.route(async (req, res) => {
      const data = await UseCases.Dynamic.deleteById(
        req.params.id,
        db,
        queues.events
      )

      res.json({ data })
    })
  )

module.exports = Dynamic
