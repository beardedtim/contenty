const env = require('getenv')

const Log = require('./infrastructure/log')
const Server = require('./server')
const Routes = require('./routes')

const server = new Server({ routes: Routes })

const port = env.int('PORT')

const cleanup = (type) => (err) => {
  server.stop(() => {
    Log.fatal({ err }, `${type} :: Shutting Down`)
    process.exit(1)
  })
}

process.on('uncaughtException', cleanup('Uncaught Exception'))
process.on('unhandledRejection', cleanup('Unhandled Rejection'))

server.start(port, () => Log.info({ port }, 'Service Started'))
