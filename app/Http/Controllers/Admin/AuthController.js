'use strict'
const _ = require('lodash')
const User = use('App/Model/User')
const Hash = use('Hash')
const Validator = use('Validator')

class AuthController {

  * register(req, res) {
    const validation = yield Validator.validateAll(req.all(), User.registerRules)

    if (validation.fails()) {
      return res.json({ status: false, message: validation.messages() })
    }
    let mobile = req.input('mobile', '')
    let email = req.input('email', '')
    const user = yield User.findOne({ $or:[{'email':email}, {'mobile':mobile} ]})
    if (user) {
      return res.json({ status: false, messageCode: "USER_ALREADY_EXIST"})
    } else {
      yield User.create({
        mobile: mobile,
        fullname: req.input('fullname', ''),
        email: email,
        password: yield Hash.make(req.input('password'))
      })
    }
    return res.json({ status: true, messageCode: 'EMAIL_VERIFY' })
  }


  * login (req, res) {
    if (req.method() == 'GET') {
      return yield res.sendView('auth/login', { isAdmin: true })
    } else {
      const validation = yield Validator.validateAll(req.all(), User.loginRules)
      if (validation.fails()) {
        yield req.withAll().andWith({errors: validation.messages()}).flash()
      } else {
        const user = yield User.findOne({ email: req.input('email') })
        if (user) {
          if (Hash.verify(req.input('password'), user.password)) {
            user.adminToken = yield Hash.make(new Date().toString())
            user.save()
            yield req.session.put('adminToken', user.adminToken)
            yield req.with({ message: 'You have successfully login' }).flash()
          } else {
            yield req.withAll().andWith({ passworderror: 'Invalid Password' }).flash()
          }
        } else {
          yield req.withAll().andWith({ emailerror: 'Invalid Credentials' }).flash()
        }
      }
      return yield res.redirect('/manage')
    }
  }

  * logout (req, res) {
    yield req.session.forget('adminToken')
    yield req.with({ message: 'You have successfully logout' }).flash()
    yield res.redirect('/manage/login')
  }

  * verification (req, res) {
    let verification = req.param('verification')
    let token = req.param('token')

    let user = yield User.findOne({ emailToken: token, verification: verification, verified: false})
    if (user) {
      user.verified = true
      user.save()
      yield res.sendView('mail/confirmation')
    } else {
      res.status(404).send('Not Found')
    }

  }

}

module.exports = AuthController
