'use strict'
const User = use('App/Model/User')
const View = use('View')

module.exports =  {

  * handle (request, response, next) {
    const webToken = yield request.session.get('webToken', false)
    if (webToken) {
      const user = yield User.findOne({ webToken: webToken })
      if (user) {
        return response.redirect('/')
      }
    }
    yield next
  }
}
