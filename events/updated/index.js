const utils = require('../utils')
const handler = require('./process-job')

module.exports = utils.createEvent({
  name: 'UPDATED',
  action: (slug, value) => ({
    payload: value,
    meta: {
      slug,
    },
  }),
  handler,
})
