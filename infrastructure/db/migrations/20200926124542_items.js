/**
 *
 * @param {import('knex')} knex
 */
exports.up = function(knex) {
  return knex.schema.createTable('items', table => {
    table.uuid('id')
      .primary()
      .notNullable()
      .defaultTo(knex.raw('uuid_generate_v4()'))

    table.uuid('collection_id')
      .notNullable()
      .comment('The UUID of the Collection This Item is Attached To')

    table.jsonb('data')
      .notNullable()
      .defaultTo({})
      .comment('The Key/Value Pairing Associated with This Item')
    
    table.foreign('collection_id')
      .references('collections.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
};

/**
 *
 * @param {import('knex')} knex
 */
exports.down = function(knex) {
  return knex.schema.dropTable('items')
};
