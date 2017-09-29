'use strict'

const MongoAuth = require('../../Serializers/MongoAuth');

class MongoJWTMiddleware {

  * handle (request, response, next) {
    request.jwt = new MongoAuth()

    if (request.input('token')) {
      const user = yield request.jwt.getUser(request)
      if (user) {
        request.user = user
        request.isAuthed = true
      }
    }
    yield next

  }

}

module.exports = MongoJWTMiddleware
