'use strict'
const User = use('App/Model/User')
const View = use('View')

class ProfileGuard {

  * handle (request, response, next) {
    if (request.user) {
      if (!request.user.verified) {
        return response.redirect('/verify-email')
      } else if (!request.user.hasProfile) {
        return response.redirect('/profile-setup')
      } else {
        yield next
      }
    } else {
      return response.redirect('/login')
    }

  }
}

module.exports = ProfileGuard
