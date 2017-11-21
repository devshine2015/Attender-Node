'use strict'

const User = use('App/Model/User')
const Staff = use('App/Model/Staff')
const Task = use('App/Model/Task')
const Suggestion = use('App/Model/Suggestion')
const StaffManagement = use('App/Model/StaffManagement')
const Venue = use('App/Model/Venue')
const Message = use('App/Model/Message')
const Event = use('App/Model/Event')
const VenueNotification = use('App/Model/VenueNotification')
const moment = require('moment')

class VenueController {

  * getVenue (req) {
    let venue = yield Venue.findOne({ _id: req.param('id') })
    if (venue) {
      venue = yield this.formatHours(venue)
      return venue
    }
  }

  * formatHours(venue) {
    venue.weekdayStart = moment(venue.openingHours.Weekdays.startWeekDays).format('LT')
    venue.weekdayEnd = moment(venue.openingHours.Weekdays.endWeekDays).format('LT')
    venue.weekendStart = moment(venue.openingHours.Weekends.startWeekEnds).format('LT')
    venue.weekendEnd = moment(venue.openingHours.Weekends.endWeekEnds).format('LT')
    return venue
  }

  * index (req, res) {
    let venues = yield Venue.find({})
    for (let venue of venues) {
      venue = yield this.formatHours(venue)
    }
    yield res.sendView('web/venue/index', { venues: venues })
  }

  * interest (req, res) {
    let _venue = yield this.getVenue(req)
    if (req.user.isStaff) {
      _venue.interested[req.user.staffId] = { staffId: req.user.staffId, interestedAt: new Date(), include: true }
      _venue.markModified('interested')
      _venue.save()
      let notification = yield VenueNotification.create({
        venueId: _venue._id,
        staffId: req.user.staffId._id,
        type: 'venue-interest'
      })
      return res.json({ status: true, venue: _venue })
    } else {
      return res.json({ status: false, messageCode: 'INVALID_PROFILE' })
    }
  }

  * select (req, res) {
    let _venue = yield this.getVenue(req)
    let events = yield Event.find({ venueId: _venue._id })
    yield res.sendView('web/venue/select', { venue: _venue, events: events })
  }

  * save (req, res) {
    let openingHours = {
        Weekdays : {
            startWeekDays : moment(req.input('weekday_start'), 'h:mm A').format(),
            endWeekDays : moment(req.input('weekday_end'), 'h:mm A').format()
        },
        Weekends : {
            startWeekEnds : moment(req.input('weekend_start'), 'h:mm A').format(),
            endWeekEnds : moment(req.input('weekend_end'), 'h:mm A').format()
        }
    }
    let venue = yield Venue.create({
      user: req.user._id,
      name: req.input('name', ''),
      managerName: req.input('managerName', ''),
      type: req.input('types', []),
      locationName: req.input('location', ''),
      openingHours: openingHours,
      numberEmployees: req.input('numberEmployees', 0),
      services: req.input('services', [])
    })
    req.user.venueId = venue._id
    req.user.isVenue = true
    req.user.hasProfile = true
    req.user.save()
    return res.json({ status: true, venue: venue })

  }

  * messages (req, res) {
    let threads = yield Message.aggregate(
      {
        $match: { $or : [{ sender: req.user._id }, { receiver: req.user._id }], archivedTo: { $ne: req.user._id }, hiddenTo: { $ne: req.user._id } }
      }, {
        $lookup : {
         from: 'staffs',
         localField: 'staff',
         foreignField: '_id',
         as: 'staff'
        }
      }, {
        $unwind: '$staff'
      }, {
        $group: {
          _id: '$conversation',
          latest: { $last: '$sentAt' },
          message: { $last: '$message' },
          delivered: { $last: '$delivered' },
          seen: { $last: '$seen' },
          usid: { $last: '$staff.user'},
          uselect: { $last: '$staff._id' },
          uname: { $last: '$staff.fullname' },
          uavatar: { $last: '$staff.avatar'}
        }
      }, {
        $sort: { latest: -1 }
      }
    )
    res.json({ status: true, threads: threads })
    yield Message.update({ receiver: req.user._id, delivered: false }, { delivered: true }, { multi: true })
  }

  * renderMyStaffs (req, res) {
    yield res.sendView('web/staff/venuestaff')
  }

  * interestedStaffs (req, res) {
    let venue = yield Venue.findOne({ _id: req.user.venueId })
    let interested = yield Staff.find({ _id: { $in: venue.myStaffs } }).populate('user', '_id')
    res.json({ status: true, interested: interested })
  }

  * myStaffs (req, res) {
    let staffs = yield StaffManagement
                      .find({ venue: req.user.venueId })
                      .populate('staff')
                      .populate('tasks', '_id description createdAt', null, { sort: { 'createdAt': -1 } })
                      .populate('suggestions', '_id description createdAt', null, { sort: { 'createdAt': -1 } })

    res.json({ status: true, staffs: staffs })
  }

}

module.exports = VenueController
