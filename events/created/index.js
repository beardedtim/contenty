const utils = require('../utils')
const handler = require('./process-job')

module.exports = utils.createEvent({
  name: 'CREATED',
  action: (slug, value) => ({
    payload: value,
    meta: {
      slug,
    },
  }),
  handler,
})
