const env = require('getenv')
const Log = require('../infrastructure/log')

const IS_PRODUCTION = env.string('NODE_ENV', '') === 'production'

module.exports.cors = require('cors')
module.exports.security_headers = require('helmet')

module.exports.logError = () => (error, req, res, next) => {
  Log.error({ err: error, req, res }, 'HTTP Error')

  return next(error)
}

module.exports.handleError = () => (error, req, res, next) => {
  const code =
    error.code && error.code > 99 && error.code < 600 ? error.code : 500

  const message = error.message || 'Internal Server Error'
  const stack = IS_PRODUCTION ? undefined : error.stack
  const data = error.data

  res.status(code).json({ error: { message, stack, code, data } })
}

module.exports.route = (handler) => async (req, res, next) => {
  try {
    await handler(req, res)
  } catch (e) {
    next(e)
  }
}

module.exports.validateBody = (schema) => async (req, res, next) => {
  const { error, value } = await schema.validate(req.body)

  if (error) {
    error.code = 400

    return next(error)
  }

  req.body = value

  return next()
}
