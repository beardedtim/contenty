/**
 *
 * @param {import('knex')} knex
 */
exports.up = function (knex) {
  return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
}

/**
 *
 * @param {import('knex')} knex
 */
exports.down = function (knex) {
  return knex.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
}
