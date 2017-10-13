'use strict'
const User = use('App/Model/User')
const View = use('View')

class AdminGuard {

  * handle (request, response, next) {
    const adminToken = yield request.session.get('adminToken', false)
    if (adminToken) {
      const user = yield User.findOne({ adminToken: adminToken, isAdmin: true })
      if (user) {
        if (user.isAdmin) {
          request.admin = user
          request.isAuthed = true
          View.global('admin', request.admin)

          yield next
        } else {
          return response.redirect('/manage/login')
        }
      } else {
        return response.redirect('/manage/login')
      }
    } else {
      return response.redirect('/manage/login')
    }

  }
}

module.exports = AdminGuard
