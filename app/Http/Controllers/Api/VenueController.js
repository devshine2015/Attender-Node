'use strict'
const Message = use('App/Model/Message')
const Venue = use('App/Model/Venue')
const Staff = use('App/Model/Staff')
const Organizer = use('App/Model/Organizer')
const Event = use('App/Model/Event')
const VenueNotification = use('App/Model/VenueNotification')
const Validator = use('Validator')

class VenueController {

  * getVenue (req) {
    return yield Venue.findOne({ _id: req.param('id') })
  }

  * index (req, res) {
    let services = req.input('services', false)
    let types = req.input('types', false)
    let venues = yield Venue.find({})
    if (services) {
      services = services.split(',')
      venues = venues.filter((venue) => {
          for (let service of services) {
            let i = venue.services.indexOf(service)
            if (i >= 0) {
              return true
            }
          }
      })
    }
    if (types) {
      types = types.split(',')
      venues = venues.filter((venue) => {
          for (let type of types) {
            let i = venue.type.indexOf(type)
            if (i >= 0) {
              return true
            }
          }
      })
    }
    res.json({ status: true, venues: venues, messageCode: 'SUCCESS' })
  }

  * notifications (req, res) {
    if (req.user.isVenue) {
      let venue = req.user.venueId
      let count = yield VenueNotification.find({ opened: false, venueId: venue._id }).count()
      let notifications = yield VenueNotification.find({ venueId: venue._id }).populate('eventId').populate('staffId').populate('venueId').sort('-createdAt')
      res.json({ status: true, messageCode: 'SUCCESS', notifications: notifications, new: count })
      yield VenueNotification.update({ opened: false, venueId: venue._id }, { opened: true }, { multi: true })
    } else {
     res.json({ status: false, messageCode: 'INVALID_PROFILE' })
    }
  }

  * interest (req, res) {
    let _venue = yield this.getVenue(req)
    if (req.user.isStaff) {
      _venue.interested[req.user.staffId._id] = { staffId: req.user.staffId._id, interestedAt: new Date() }
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

  * interested (req, res) {
    if (req.user.isVenue) {
      let staffs = yield Staff.find({ _id: { $in: req.user.venueId.myStaffs } })
      return res.json({ status: true, messageCode: 'SUCCESS', staffs: staffs })

    } else {
      return res.json({ status: false, messageCode: 'INVALID_PROFILE' })
    }
  }

  * sendStaffMsg (req, res) {
    let message = yield Message.create({
      sender: req.user._id,
      receiver: req.input('receiver'),
      message: req.input('message'),
      staff: req.input('staff', ''),
      venue: req.user.venueId._id
    })
    return res.json({ status: true })
  }


}

module.exports = VenueController
