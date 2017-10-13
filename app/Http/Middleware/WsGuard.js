'use strict'

class WsGuard {

  * handle (request, response, next) {
    console.log('Middleware');
    yield next
  }

}

module.exports = WsGuard
