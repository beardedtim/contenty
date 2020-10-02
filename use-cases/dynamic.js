const DBErrors = require('../errors/db')
const JSONSchema = require('jsonschema')

class NoCollectionWithSlug extends Error {
  constructor(slug) {
    super()

    this.message = `Cannot find collection with slug "${slug}"`

    this.code = 400
  }
}

class BadInput extends Error {
  constructor(errors) {
    super()

    this.message = `Input failed validation :
${errors.map(({ stack }) => stack)}
`
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

const validateItem = (schema, item) => {
  const valid = JSONSchema.validate(item, schema)

  if (valid.errors.length) {
    throw new BadInput(valid.errors)
  }

  return item
}

const safe_keys = ['id', 'data', 'last_updated', 'created_at']

module.exports.list = async (collectionSlug, query, db) => {
  const collection = await getCollection(collectionSlug, db)

  return db
    .from('items')
    .where({ collection_id: collection.id })
    .andWhere(builder =>  {
      for (const [key, { value, relation }] of Object.entries(query.where))   {
       builder.andWhereRaw(`${key} ${relation} ?`, [value])
      }

      return builder
    })
    .select(safe_keys)
    .limit(query.limit)
    .offset(query.offset)
    .orderBy(query.sort_col, query.sort_ord)
    .catch((err) => {
      console.dir(err)
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

  if(collection.schema) {
    item = validateItem(collection.schema, item)
  }

  const [created] = await db
    .into('items')
    .insert({
      collection_id: collection.id,
      data: item,
    })
    .returning(safe_keys)

  return created
}

const getById = (id, db) =>
  db.from('items').where({ id }).select(['id', 'data']).first()

module.exports.getById = getById

module.exports.updateById = async ({ id, slug }, update, db) => {
  const collection = await getCollection(slug)

  const item = await getById(id, db)
  let newData = {
    ...item.data,
    ...update,
  }

  if (collection.schema) {
    newData = validateItem(collection.schema, newData)
  }

  const [updated] = await db
    .from('items')
    .where({ id })
    .update({
      data: newData,
      last_updated: new Date().toISOString()
    })
    .returning(safe_keys)

  return updated
}

module.exports.deleteById = async (id, db) => {
  const [removed] = await db
    .from('items')
    .where({ id })
    .del()
    .returning(safe_keys)

  return removed
}
