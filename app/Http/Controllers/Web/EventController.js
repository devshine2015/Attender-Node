'use strict'

const Event = use('App/Model/Event')
const VenueNotification = use('App/Model/VenueNotification')
const moment = require('moment')

class EventController {

  * getEvent (req) {
    return yield Event.findOne({ _id: req.param('id') }).populate('venueId')
  }

  * index (req, res) {
    let events = []
    if (req.user.isVenue) {
      events = yield Event.find({ venueId: req.user.venueId }).populate('venueId')
    } else {
      events = yield Event.find({}).populate('venueId')
    }
    yield res.sendView('web/event/index', { events: events })
  }

  * interest (req, res) {
    let _event = yield this.getEvent(req)
    if (req.user.isStaff) {
      _event.venueId.interested[req.user.staffId] = { staffId: req.user.staffId, interestedAt: new Date() }
      _event.venueId.markModified('interested')
      _event.venueId.save()
      _event.interested[req.user.staffId] = { staffId: req.user.staffId, interestedAt: new Date() }
      _event.markModified('interested')
      _event.save()
      let notification = yield VenueNotification.create({
        venueId: _event.venueId._id,
        staffId: req.user.staffId._id,
        type: 'event-interest'
      })
      return res.json({ status: true, _event: _event })
    } else {
      return res.json({ status: false, messageCode: 'INVALID_PROFILE' })
    }
  }

  * create (req, res) {
    if (req.user.isVenue || req.user.isOrganizer) {
      yield res.sendView('web/event/create')
    }
  }
  * store (req, res) {

  }

}

module.exports = EventController
