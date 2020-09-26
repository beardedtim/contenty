const express = require('express')
const invariant = require('../utils/invariant')
const preware = require('./preware')
const postware = require('./postware')

class Server {
  #app
  #instance

  constructor({ routes }) {
    this.#app = express()

    for (const middleware of preware) {
      this.#app.use(middleware())
    }

    this.#app.use(routes)

    for (const middleware of postware) {
      this.#app.use(middleware())
    }
  }

  start(port, cb) {
    invariant(
      !this.#instance,
      'Cannot start a server that has already been started. Please stop the server instance and try calling start again.'
    )

    this.#instance = this.#app.listen(port, cb)

    return this
  }

  stop(cb) {
    if (!this.#instance) {
      cb()

      return this
    }

    this.#instance.close(cb)

    this.#instance = undefined

    return this
  }
}

module.exports = Server
