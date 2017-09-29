'use strict'

const MongoAuth = require('../../Serializers/MongoAuth');

class JWTGuard {

  * handle (request, response, next) {
    request.jwt = new MongoAuth()

    if (request.header('x-request-token', false) || request.input('token', false)) {
      const user = yield request.jwt.getUser(request)
      if (user) {
        request.user = user
        request.isAuthed = true
        yield next
      }
    }

    return response.json({ status: false, messageCode: 'UNAUTHORIZED' })
  }

}

module.exports = JWTGuard
