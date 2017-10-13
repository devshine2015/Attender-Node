'use strict'

const moment = require('moment')
const Organizer = use('App/Model/Organizer')
const Venue = use('App/Model/Venue')
const Staff = use('App/Model/Staff')
const User = use('App/Model/User')
const Hash = use('Hash')
const Validator = use('Validator')

class UserController {

  * getUser (req, res) {
    return yield User.findOne({ _id: req.param('id') }).populate('organizerId').populate('venueId').populate('staffId')
  }

  * index (req, res) {
    let users = yield User.find({})
    yield res.sendView('user/index', { users: users })
  }

  * create (req, res) {
    yield res.sendView('user/create')
  }

  * store (req, res) {
    const validation = yield Validator.validateAll(req.all(), User.registerRules )
    if (validation.fails()) {
      yield req.withAll().andWith({ errors: validation.messages() }).flash()
      res.redirect('back')
    } else {
      const user = yield User.create(req.except('password'))
      user.password = yield Hash.make(req.input('password'))
      yield req.with({ message: 'User created successfully' }).flash()
      res.redirect('/manage/users')
    }

  }

  * show (req, res) {
    const user = yield this.getUser(req, res)
    if (user.isVenue) {
      user.venueId.weekdayStart = moment(user.venueId.openingHours.Weekdays.startWeekDays).format('LT')
      user.venueId.weekdayEnd = moment(user.venueId.openingHours.Weekdays.endWeekDays).format('LT')
      user.venueId.weekendStart = moment(user.venueId.openingHours.Weekends.startWeekEnds).format('LT')
      user.venueId.weekendEnd = moment(user.venueId.openingHours.Weekends.endWeekEnds).format('LT')
    }
    yield res.sendView('user/select', { user: user })
  }

  * edit (req, res) {
    const user = yield this.getUser(req, res)
    yield res.sendView('user/edit', { user: user, edit: true })
  }

  * update (req, res) {
    const user = yield this.getUser(req, res)
    user.fullname = req.input('fullname', user.fullname)
    user.email = req.input('email', user.email)
    user.mobile = req.input('mobile', user.mobile)
    user.updatedAt = new Date()
    user.isAdmin = req.input('isAdmin', false)
    if (req.input('password', false))
      user.password = yield Hash.make(req.input('password'))
    user.save()
    yield req.with({ message: `User ${req.fullname} updated successfully` }).flash()
    return res.redirect('/manage/users')
  }

  * destroy (req, res) {
    let user = yield this.getUser(req, res)
    if(user) {
      user.remove()
      res.json({ status: true })
    } else {
      res.json({ status: false })
    }
  }

}

module.exports = UserController
