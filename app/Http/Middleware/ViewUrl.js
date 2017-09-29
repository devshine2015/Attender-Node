'use strict'

const View = use('View')

class ViewUrl {

  * handle (request, response, next) {

    let baseUrl = request.header('x-forwarded-proto', 'http') + '://' + request.header('host') + '/'

    View.global('url', (path) => {
      if (typeof path != 'undefined') {
        path = (path.substring(0, 1) == '/') ? path.substring(1) : path
        return baseUrl + path
      }
      return baseUrl
    })

    View.global('assets', (assetPath) => {
      assetPath = (assetPath.substring(0, 1) == '/') ? assetPath.substring(1) : assetPath
      return baseUrl + assetPath
    })

    yield next
  }

}

module.exports = ViewUrl
