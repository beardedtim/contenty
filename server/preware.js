const middleware = require('./middleware')
module.exports = [middleware.cors, middleware.security_headers]
