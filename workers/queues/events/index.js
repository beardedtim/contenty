const events = require('../../../events')
const queues = require('../../../infrastructure/queues')

module.exports.start = () => {
  for (const { handler, name } of Object.values(events)) {
    queues.events.process(name, handler)
  }
}
