const DBErrors = require('../errors/db')

class NoCollectionWithSlug extends Error {
  constructor(slug) {
    super()

    this.message = `Cannot find collection with slug "${slug}"`

    this.code = 400
  }
}

const getCollection = async (slug, db) => {
  const collection = await db
    .from('collections')
    .where({ slug })
    .first()
    .select('*')

  if (!collection) {
    throw new NoCollectionWithSlug(slug)
  }

  return collection
}

module.exports.list = async (collectionSlug, query, db) => {
  const collection = await getCollection(collectionSlug, db)

  return db
    .from('items')
    .where({ collection_id: collection.id, ...query.where })
    .select(['id', 'data'])
    .limit(query.limit)
    .offset(query.offset)
    .orderBy(query.sort_col, query.sort_ord)
    .catch((err) => {
      const regexp = /column "(.+)" does not exist/
      const columnMissing = regexp.exec(err)

      if (columnMissing) {
        throw new DBErrors.MissingColumn(columnMissing[1], 'query')
      } else {
        throw err
      }
    })
}

module.exports.create = async (collectionSlug, item, db) => {
  const collection = await getCollection(collectionSlug, db)

  const [created] = await db
    .into('items')
    .insert({
      collection_id: collection.id,
      data: item,
    })
    .returning(['id', 'data'])

  return created
}

const getById = (id, db) =>
  db.from('items').where({ id }).select(['id', 'data']).first()
module.exports.getById = getById

module.exports.updateById = async (id, update, db) => {
  const item = await getById(id, db)

  const [updated] = await db
    .from('items')
    .where({ id })
    .update({
      data: {
        ...item.data,
        ...update,
      },
    })
    .returning(['id', 'data'])

  return updated
}

module.exports.deleteById = async (id, db) => {
  const [removed] = await db
    .from('items')
    .where({ id })
    .del()
    .returning(['id', 'data'])

  return removed
}
