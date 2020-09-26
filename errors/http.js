module.exports.ResourceNotFound = class ResourceNotFound extends Error {
  constructor(resource) {
    super()

    this.message = `Could not find resource ${resource}.`

    this.code = 400
  }
}