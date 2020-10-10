module.exports.wrap = (queue) => ({
  publish: ({ type, ...payload }) => queue.add(type, payload),
  process: queue.process.bind(queue),
})
