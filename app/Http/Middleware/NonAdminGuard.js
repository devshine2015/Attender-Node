'use strict'
const User = use('App/Model/User')
const View = use('View')

module.exports =  {

  * handle (request, response, next) {
    const adminToken = yield request.session.get('adminToken', false)
    if (adminToken) {
      const user = yield User.findOne({ adminToken: adminToken, isAdmin: true })
      if (user) {
        if (user.isAdmin) {
          return response.redirect('/')
        }
      }
    }
    yield next
  }
}
