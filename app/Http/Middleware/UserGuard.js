'use strict'
const User = use('App/Model/User')
const View = use('View')

class UserGuard {

  * handle (request, response, next) {
    const webToken = yield request.session.get('webToken', false)
    if (webToken) {
      const user = yield User.findOne({ webToken: webToken })
      if (user) {
        request.user = user
        request.isAuthed = true
        response.viewInstance.global('user', user)
        // if (!user.verified) {
        //   return response.redirect('/verify-email')
        // } else
        if (!user.hasProfile) {
          return response.redirect('/profile-setup')
        } else {
          yield next
        }

      } else {
        return response.redirect('/login')
      }
    } else {
      return response.redirect('/login')
    }
  }
}

module.exports = UserGuard
