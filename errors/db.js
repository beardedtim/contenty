module.exports.MissingColumn = class MissingColumn extends Error {
  constructor(column, action) {
    super()

    this.message = `You cannot ${action} with column "${column}" due to it not existing in the database.`
    this.code = 400
  }
}
