'use strict'

const User = use('App/Model/User')
const Employer = use('App/Model/Employer')
const moment = require('moment')

module.exports = class VenueController {

  * getVenue (req) {
    let venue = yield Employer.findOne({ _id: req.param('id') }).populate('user')
    if (venue) {
      venue.weekdayStart = moment(venue.openingHours.monday.start).format('LT')
      venue.weekdayEnd = moment(venue.openingHours.monday.end).format('LT')
      venue.weekendStart = moment(venue.openingHours.sunday.start).format('LT')
      venue.weekendEnd = moment(venue.openingHours.sunday.end).format('LT')
      return venue
    }

  }

  * getAvailableUsers() {
    return yield User.find({ hasProfile: false, isAdmin: false })
  }

  * getUsers() {
    return yield User.find()
  }

  * index (req, res) {
    let venues = yield Employer.find({isVenue : true}).populate('user')
    yield res.sendView('venue/index', { venues: venues })
  }

  * show (req, res) {
    let venue = yield this.getVenue(req)
    yield res.sendView('venue/select', { venue: venue })
  }

  * create (req, res) {
    let availableUsers = yield this.getAvailableUsers()
    yield res.sendView('venue/create', { availableUsers:availableUsers })
  }

  * store (req, res) {
    let weekDayStart = moment(req.input('weekday-start'), 'HH:mm a').format(),
        weekDayEnd = moment(req.input('weekday-end'), 'HH:mm a').format(),
        weekEndStart = moment(req.input('weekend-start'), 'HH:mm a').format(),
        weekEndEnd = moment(req.input('weekend-end'), 'HH:mm a').format()
    let user = yield User.findOne({ _id: req.input('user') })
    if (user) {
      let openingHours = {
          Weekends : {
              endWeekEnds : weekEndEnd,
              startWeekEnds : weekEndStart
          },
          Weekdays : {
              endWeekDays : weekDayEnd,
              startWeekDays : weekDayStart
          }
      }
      let venue = yield Venue.create({
        user: req.input('user', ''),
        name: req.input('name', ''),
        managerName: req.input('managerName', ''),
        type: req.input('types', ''),
        location: [],
        locationName: req.input('locationName', ''),
        openingHours: openingHours,
        numberEmployees: req.input('numberEmployees', 0),
        services: req.input('services', ''),
        socialMedia: {}
      })
      user.venueId = venue._id
      user.isVenue = true
      user.hasProfile = true
      user.save()
      return res.redirect('/manage/venues')
    } else {
      yield this.create(req, res)
    }
  }

  * edit (req, res) {
    let venue = yield this.getVenue(req)
    let availableUsers = yield this.getAvailableUsers()
    availableUsers.push(venue.user)
    yield res.sendView('venue/edit.njk', { venue: venue, availableUsers: availableUsers })
  }

  * update (req, res) {
    let venue = yield this.getVenue(req)
    let weekDayStart = moment(req.input('weekday-start'), 'HH:mm a').format(),
        weekDayEnd = moment(req.input('weekday-end'), 'HH:mm a').format(),
        weekEndStart = moment(req.input('weekend-start'), 'HH:mm a').format(),
        weekEndEnd = moment(req.input('weekend-end'), 'HH:mm a').format()
    let openingHours = {
      Weekends : {
          endWeekEnds : weekEndEnd,
          startWeekEnds : weekEndStart
      },
      Weekdays : {
          endWeekDays : weekDayEnd,
          startWeekDays : weekDayStart
      }
    }
    let user = req.input('user', '')
    let oldUser = venue.user
    venue.user = user || venue.user._id
    venue.name = req.input('name', venue.name)
    venue.managerName = req.input('managerName', venue.managerName)
    venue.type = req.input('types', '') || venue.type
    venue.locationName = req.input('locationName', venue.locationName)
    venue.openingHours = openingHours || venue.openingHours
    venue.numberEmployees = req.input('numberEmployees', 0)
    venue.services = req.input('services', '') || venue.services
    venue.save()
    if (user) {
      let newUser = yield User.findOne({ _id: user })
      if (newUser) {
        newUser.hasProfile = true
        newUser.isVenue = true
        newUser.venueId = venue._id
        newUser.save()
        oldUser.hasProfile = false
        oldUser.isVenue = false
        oldUser.venueId = undefined
        oldUser.save()
      }
    }

    return res.redirect('/manage/venues')
  }
  * destroy (req, res) {
    let venue = yield this.getVenue(req, res)
    if(venue) {
      venue.remove()
      res.json({ status: true })
    } else {
      res.json({ status: false })
    }
  }
}
