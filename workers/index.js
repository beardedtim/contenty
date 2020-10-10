const queues = require('./queues')

module.exports = {
  start: (cb) => {
    for (const [queue_name, queue] of Object.entries(queues)) {
      queue.start()
    }

    return cb()
  },
}
