/**
 *
 * @param {import('knex')} knex
 */
exports.up = function (knex) {
  return knex.schema.table('items', (table) => {
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('NOW()'))

    table.timestamp('last_updated').notNullable().defaultTo(knex.raw('NOW()'))
  })
}

/**
 *
 * @param {import('knex')} knex
 */
exports.down = function (knex) {
  return knex.schema.table('items', (table) => {
    table.dropColumn('created_at')
    table.dropColumn('last_updated')
  })
}
