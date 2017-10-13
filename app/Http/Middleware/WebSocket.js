'use strict'
const User = use('App/Model/User')
const MongoAuth = require('../../Serializers/MongoAuth');

module.exports = class WebSocketAuth {

  * webAuth (token) {
    const user = yield User.findOne({ webToken: token })
    if (user) {
      console.log('merom');
      return { auth: true, user: user }
    } else {
      return { auth: false }
    }
  }

  * mobileAuth (token) {
    let auth = new MongoAuth()
    let user = yield auth.verifyRequestToken(token)

    if (user) {
      return { auth: true, user: user }
    } else {
      return { auth: false }
    }

  }

}
