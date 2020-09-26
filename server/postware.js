const middleware = require('./middleware')

module.exports = [middleware.logError, middleware.handleError]
