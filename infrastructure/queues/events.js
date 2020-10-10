const Queue = require('bull')
const env = require('getenv')
const { wrap } = require('./utils')

const EventsQueue = new Queue('events', {
  redis: { port: env.int('QUEUE_PORT') },
})

module.exports = wrap(EventsQueue)
