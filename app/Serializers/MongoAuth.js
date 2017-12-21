'use strict'
const Employer = require('../Model/Employer')
const Staff = require('../Model/Staff')
const Organizer = require('../Model/Organizer')
const Venue = require('../Model/Venue')
const User = require('../Model/User')
const Hash = use('Hash')
const jwt = require('jsonwebtoken');
const Config = use('Config')

class MongoAuth {

  * generate (user, expiry) {
    const tokenObject = {
      token: yield this.signToken(user._id, Config.get('app.appKey')),
      forever: !expiry,
      expiry: expiry ? new Date(Date.now() + expiry) : null,
      is_revoked: false
    }
    const userSchema = yield User.findOne({ email: user.email })
    userSchema.token = tokenObject
    const isSaved = yield userSchema.save()
    return isSaved ? tokenObject : null
  }

  * generateToken (userSchema, expiry) {
    userSchema.token = {
      token: yield this.signToken(userSchema._id, Config.get('app.appKey')),
      forever: !expiry,
      expiry: expiry ? new Date(Date.now() + expiry) : null,
      is_revoked: false
    }
    return yield userSchema.save()
  }

  * verify (request) {
    try {
      const token = request.input('token') || request.header('x-request-token')
      const user = yield this.verifyRequestToken(token)
      return user ? user : false
    } catch(e) {
      console.log(e.message)
      return false
    }
  }

  * auth (request) {
    const userAuth = yield User.findOne({ email: request.input('email') })
    if (userAuth) {
      const samePassword = yield Hash.verify(request.input('password'), userAuth.password)
      if (samePassword) {
        yield this.generateToken(userAuth, 3600)
        userAuth.apiKey = userAuth.token.token
        userAuth.password = undefined
        return userAuth
      } else {
        return false
      }

    } else {
      return false
    }
  }

  * authMobile (request) {
    const userAuth = yield User.findOne({ mobile: request.input('mobile') }).populate('staffId').populate('venueId').populate('organizerId').populate('employer')
    if (userAuth) {
      yield this.generateToken(userAuth, 3600)
      userAuth.token = userAuth.token.token
      userAuth.password = undefined
      return userAuth
    } else {
      return false
    }
  }

  signToken(payload, secret, options) {
    return new Promise((resolve, reject) => {
      jwt.sign({payload: payload}, secret, options, function (error, token) {
        if (error) {
          return reject(error)
        }
        resolve(token)
      })
    })
  }

  verifyRequestToken (token, options) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, Config.get('app.appKey'), options, (error, decoded) => {
        if (error) {
          return reject(error)
        }
        resolve(decoded)
      })
    })
  }

  * getUser(request) {
    const user = yield this.verify(request)
    if (user) {
      const fields = 'fullname email avatar hasProfile facebookId googleId instagramId isSocialLogin isStaff staffId isActive isVenue venueId isOrganizer organizerId isAdmin adminId avatar rememberToken emailToken apiKey employer isEmployer'
      return yield User.findOne({ _id: user.payload }, fields).populate('staffId').populate('employer').populate('venueId').populate('organizerId')
    } else {
      return false;
    }
  }

}

module.exports = MongoAuth
