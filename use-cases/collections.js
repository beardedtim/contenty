class DuplicateCollectionName extends Error {
  constructor(name) {
    super()

    this.message = `There already exists a collection with name "${name}"`
    this.code = 400
  }
}

class DuplicateCollectionSlug extends Error {
  constructor(slug) {
    super()

    this.message = `There already exists a collection with slug "${slug}"`
    this.code = 400
  }
}

class MissingColumn extends Error {
  constructor(column, action) {
    super()

    this.message = `You cannot ${action} with column "${column}" due to it not existing in the database.`
    this.code = 400
  }
}

module.exports.create = async (collection, db) => {
  try {
    const [saved] = await db
      .into('collections')
      .insert(collection)
      .returning('*')

    return saved
  } catch (e) {
    if (
      e.message.indexOf('duplicate key value violates unique constraint') > -1
    ) {
      if (e.message.indexOf('name_unique') > -1) {
        throw new DuplicateCollectionName(collection.name)
      } else {
        throw new DuplicateCollectionSlug(collection.slug)
      }
    } else {
      throw e
    }
  }
}

module.exports.list = (query, db) =>
  db
    .from('collections')
    .select('*')
    .where(query.where)
    .limit(query.limit)
    .offset(query.offset)
    .orderBy(query.sort_col, query.sort_ord)
    .catch((err) => {
      const regexp = /column "(.+)" does not exist/
      const columnMissing = regexp.exec(err)

      if (columnMissing) {
        throw new MissingColumn(columnMissing[1], 'query')
      } else {
        throw err
      }
    })

module.exports.delete = async (id, db) => {
  const [removed] = await db
    .from('collections')
    .where({ id })
    .del()
    .returning('*')

  return removed
}


module.exports.getById = (id, db) => db.from('collections').where({ id }).select('*').first()

module.exports.updateById = async (id, update, db) => {
  const [updated] = await db.from('collections').where({ id })
    .update(update)
    .returning('*')
  
  return updated
}