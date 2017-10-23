'use strict'
const _ = require('lodash')
const User = use('App/Model/User')
const Hash = use('Hash')
const Validator = use('Validator')
const View = use('View')
const SendGrid = require('../../../Serializers/SendGrid');

class AuthController {

  * verify (req, res) {
    yield res.sendView('auth/verify')
  }

  * setupProfile(req, res) {
    yield res.sendView('auth/profile')
  }

  * saveProfile(req, res) {
   console.log(req.all());
  }

  * getRegister(req, res) {
    yield res.sendView('auth/register')
  }

  * register(req, res) {
    const validation = yield Validator.validateAll(req.all(), User.registerRules)

    if (validation.fails()) {
      return res.json({ status: false, message: validation.messages() })
    }
    let mobile = req.input('mobile', '')
    let email = req.input('email', '')
    const user = yield User.findOne({ $or:[{'email':email}, {'mobile':mobile} ]})
    if (user) {
      yield req.with({ message: 'Email or Mobile already taken' }).flash()
      return yield res.redirect('/register')
    } else {
      let newuser = yield User.create({
        mobile: mobile,
        fullname: req.input('fullname', ''),
        email: email,
        password: yield Hash.make(req.input('password'))
      })
      SendGrid.sendVerification(newuser, req)

    }
    return res.redirect('/login')
  }

  * login (req, res) {
    if (req.method() == 'GET') {
      return yield res.sendView('auth/login')
    } else {
      const validation = yield Validator.validateAll(req.all(), User.loginRules)
      if (validation.fails()) {
        yield req.withAll().andWith({errors: validation.messages()}).flash()
      } else {
        const user = yield User.findOne({ email: req.input('email') })
        if (user) {
          if (Hash.verify(req.input('password'), user.password)) {
            user.webToken = yield Hash.make(user._id + new Date().toString())
            user.save()
            yield req.session.put('webToken', user.webToken)
            yield req.with({ message: 'You have successfully login' }).flash()
          } else {
            yield req.withAll().andWith({ passworderror: 'Invalid Password' }).flash()
          }
        } else {
          yield req.withAll().andWith({ emailerror: 'Invalid Credentials' }).flash()
        }
      }
      return yield res.redirect('/')
    }
  }

  * logout (req, res) {
    yield req.session.forget('webToken')
    yield req.with({ message: 'You have successfully logout' }).flash()
    yield res.redirect('login')
  }

  * verification (req, res) {
    let verification = req.param('verification')
    let token = req.param('token')

    let user = yield User.findOne({ emailToken: token, verification: verification, verified: false})
    if (user) {
      user.verified = true
      user.save()
      console.log('verified!');
      yield res.sendView('mail/confirmation')
    } else {
      res.status(404).send('Not Found')
    }

  }

}

module.exports = AuthController
