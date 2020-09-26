/**
 *
 * @param {import('knex')} knex
 */
exports.up = function(knex) {
  return knex.schema.table('collections', table => {
    table.jsonb('schema')
  })
};

/**
 *
 * @param {import('knex')} knex
 */
exports.down = function(knex) {
  return knex.schema.table('collections', table => {
    table.dropColumn('schema')
  })
};
