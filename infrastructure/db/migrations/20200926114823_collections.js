/**
 *
 * @param {import('knex')} knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('collections', (table) => {
    table
      .uuid('id')
      .primary()
      .notNullable()
      .defaultTo(knex.raw('uuid_generate_v4()'))

    table
      .text('name')
      .notNullable()
      .unique()
      .comment(
        'Human Readable Name of the Collection. Ex: Posts, Inventory, etc'
      )

    table
      .text('slug')
      .notNullable()
      .unique()
      .comment('The URI Prefix For Accessing This Collection')
  })
}

/**
 *
 * @param {import('knex')} knex
 */
exports.down = function (knex) {
  return knex.schema.dropTable('collections')
}
