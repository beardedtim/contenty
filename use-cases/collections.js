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
