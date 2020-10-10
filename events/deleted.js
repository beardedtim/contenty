const utils = require('./utils')
const R = require('ramda')

module.exports = utils.createEvent({
  name: 'DELETED',
  action: R.objOf('payload'),
  handler: async (job) => {
    console.log('DELETED')
    console.dir(job)

    return true
  },
})
