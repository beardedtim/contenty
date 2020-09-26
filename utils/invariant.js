class InvariantError extends Error {
  constructor(msg) {
    super()
    this.message = `Precondition Failed --

    ${msg}

`
    this.code = 1000
  }
}

const invariant = (condition, msg) => {
  if (!condition) {
    throw new InvariantError(msg)
  }
}

module.exports = invariant
