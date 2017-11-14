'use strict'
const _ = require('lodash')
const User = use('App/Model/User')
const Device = use('App/Model/Device')
const Hash = use('Hash')
const Validator = use('Validator')
const SendGrid = use('SendGrid')
const Twilio = use('Twilio')
const PromisePay = use('PromisePay')

class AuthController {

  * register (req, res) {
    const validation = yield Validator.validateAll(req.all())
    if (validation.fails()) {
      return res.json({ status: false, message: validation.messages() })
    }
    let mobile = req.input('mobile', '')
    let email = req.input('email', '')
    const user = yield User.findOne({ $or:[{'email':email}, {'mobile':mobile} ]})
    if (user) {
      return res.json({ status: false, messageCode: "USER_ALREADY_EXIST"})
    } else {
      let user = yield User.create({
        mobile: mobile,
        fullname: req.input('fullname', ''),
        email: email,
        password: yield Hash.make(req.input('password'))
      })
      user.emailToken = yield Hash.make(user.email)
      user.save()
      yield req.jwt.generateToken(user)
      SendGrid.sendVerification(user, req)

    }
    return res.json({ status: true, messageCode: 'EMAIL_VERIFY' })
  }

  * deviceLogin (req, res) {
    const validation = yield Validator.validateAll(req.all(), { id: 'required', type: 'required' })

    if (validation.fails()) {
      return res.json({ message: validation.messages() })
    } else {

      if (auth) {
        return res.json({ status: true, user: auth, token: auth.token.token })
      } else {
        return res.json({ status: false, messageCode: 'USER_NOT_FOUND' })
      }

    }
  }

  * login (req, res) {
    const validation = yield Validator.validateAll(req.all(), User.loginRules)
    if (validation.fails()) {
      return res.json({ message: validation.messages() })
    } else {
      const auth = yield req.jwt.auth(req)
      if (auth) {
        let deviceToken = req.input('deviceToken', false)
        if (deviceToken) {
          let exist = yield Device.findOne({ token: deviceToken })
          if (!exist) {
            yield Device.create({ token: deviceToken, user: auth._id, type: req.input('deviceType', 'ios') })
          } else {
            exist.active = true
            yield exist.save()
          }
        }
        return res.json({ status: true, messageCode: 'LOGIN_SUCCESS', token: auth.token.token })
      } else {
        return res.json({ status: false, messageCode: 'USER_NOT_FOUND' })
      }

    }
  }

  * confirm (req, res) {
    let user = yield User.findOne({ email: req.input('email', ''), confirmed: false })
    if (user) {
      if (user.verified) {
        user.confirmed = true
        user.save()
        yield req.jwt.generateToken(user)
        res.json({ status: true, messageCode: 'VERIFIED_EMAIL', token: user.token.token })
      }
    } else {
      res.json({ status: false, messageCode: 'NOT_FOUND' })
    }
  }

  * current (req, res) {
    return res.json({ status: true, messageCode: 'SUCCESS', data: req.user })
  }


  * googleReg (req, res) {
    const validation = yield Validator.validateAll(req.all(), User.googleSchema)
    if (validation.fails()) {
      return res.json({ status: false, message: validation.messages() })
    } else {
      let exist = yield User.findOne({'email': req.input('email')})
      if (exist) {
        return res.json({ status: false, messageCode: 'EMAIL_ALREADY_EXIST'})
      } else {
        let newuser = yield User.create({
          fullname: req.input('name'),
          email: req.input('email'),
          googleAuth: req.all(),
          isSocialLogin: true,
          verified: true,
          confirmed: true
        })
        yield req.jwt.generateToken(newuser)
        return res.json({ status: true, messageCode: 'SUCCESS', token: newuser.token.token })
      }
    }
  }

  * googleAuth (req, res) {
    let google = req.all()
    const validation = yield Validator.validateAll(google, {email: 'required', id: 'required'})
    if (validation.fails()) {
      return res.json({ status: false, message: validation.messages() })
    } else {
      let user = yield User.findOne({ email: google.email, 'googleAuth.id': google.id })
      if (user) {
        yield req.jwt.generateToken(user)
        return res.json({ status: true, messageCode: 'LOGIN_SUCCESS', token: user.token.token })
      } else {
        res.json({ status: false, messageCode: 'NOT_FOUND' })
      }
    }
  }


  * facebookReg (req, res) {
    const validation = yield Validator.validateAll(req.all(), User.facebookSchema)
    if (validation.fails()) {
      return res.json({ status: false, message: validation.messages() })
    } else {
      let exist = yield User.findOne({'facebookAuth.id': req.input('id')})
      if (exist) {
        return res.json({ status: false, messageCode: 'USER_ALREADY_EXIST'})
      } else {
        let newuser = yield User.create({
          fullname: req.input('name'),
          avatar: req.input('avatar', ''),
          facebookAuth: req.all(),
          isSocialLogin: true,
          verified: true,
          confirmed: true
        })
        yield req.jwt.generateToken(newuser)
        return res.json({ status: true, messageCode: 'SUCCESS', token: newuser.token.token })
      }
    }
  }

  * facebookAuth (req, res) {
    let facebook = req.all()
    const validation = yield Validator.validateAll(facebook, {id: 'required'})
    if (validation.fails()) {
      return res.json({ status: false, message: validation.messages() })
    } else {
      let user = yield User.findOne({ 'facebookAuth.id': facebook.id })
      if (user) {
        yield req.jwt.generateToken(user)
        return res.json({ status: true, messageCode: 'LOGIN_SUCCESS', token: user.token.token })
      } else {
        res.json({ status: false, messageCode: 'NOT_FOUND' })
      }
    }
  }


}

module.exports = AuthController
