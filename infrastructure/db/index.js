const Knex = require('knex')
const env = require('getenv')
const config = require('../../knexfile')

const DB = Knex({
  ...config,
  connection: {
    user: env.string('DB_USER'),
    password: env.string('DB_PASS'),
    host: env.string('DB_HOST'),
    port: env.int('DB_PORT'),
    database: env.string('DB_NAME'),
  },
  debug: true
})

module.exports = DB
