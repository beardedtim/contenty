const pino = require('pino')
const env = require('getenv')

const Log = pino({
  name: env.string('SERVICE_NAME'),
  level: env.string('LOG_LEVEL'),
  serializers: pino.stdSerializers,
  redact: ['password', '*.password'],
  prettyPrint:
    env.string('NODE_ENV', '') === 'production'
      ? undefined
      : {
          levelFirst: true,
        },
})

module.exports = Log
