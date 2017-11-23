'use strict'
const Message = use('App/Model/Message')
const Venue = use('App/Model/Venue')
const Staff = use('App/Model/Staff')
const Task = use('App/Model/Task')
const StaffRating = use('App/Model/StaffRating')
const Suggestion = use('App/Model/Suggestion')
const StaffManagement = use('App/Model/StaffManagement')
const Organizer = use('App/Model/Organizer')
const Event = use('App/Model/Event')
const VenueNotification = use('App/Model/VenueNotification')
const Validator = use('Validator')
const Notify = use('App/Serializers/Notify')

let notify = new Notify()


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

  * removeNotif (req, res) {
    let notif = yield VenueNotification.findOne({ _id: req.param('id') })
    if (notif) {
      notif.remove()
      res.json({ status: true, messageCode: 'DELETED' })
    } else {
      res.json({ status: false, messageCode: 'NOT_FOUND' })
    }
  }

  * interest (req, res) {
    let _venue = yield this.getVenue(req)
    if (req.user.isStaff) {
      _venue.interested[req.user.staffId._id] = { staffId: req.user.staffId._id, interestedAt: new Date(), include: true }
      _venue.markModified('interested')
      _venue.save()
      let notification = yield VenueNotification.create({
        venueId: _venue._id,
        staffId: req.user.staffId._id,
        type: 'venue-interest'
      })
      res.json({ status: true, venue: _venue })
      yield notify.venueInterest(req.user.staffId, _venue)
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

  * activeStaffs (req, res) {
    let staffs = yield StaffManagement
                      .find({ venue: req.user.venueId._id, trial: false })
                      .populate('staff')
                      .populate('ratings')
                      .populate('tasks', '_id description createdAt', null, { sort: { 'createdAt': -1 } })
                      .populate('suggestions', '_id description createdAt', null, { sort: { 'createdAt': -1 } })

    res.json({ status: true, staffs: staffs })
  }

  * trialStaffs (req, res) {
    let query = req.input('query', false)
    if (query) {
      let rawStaffs = yield Staff.find({ fullname: {$in: new RegExp(query.toString().trim()) } })
      let trials = []
      for (let staff of rawStaffs) {
        trials.push(staff._id.toString())
      }
      let staffs = yield StaffManagement.find({ staff: { $in: trials }, venue: req.user.venueId._id, trial: true })
                                        .populate('staff')
      return res.json({ status: true, staffs: staffs })
    } else {
      let staffs = yield StaffManagement
                        .find({ venue: req.user.venueId._id, trial: true })
                        .populate('staff')
                        .populate('ratings')
                        .populate('tasks', '_id description createdAt', null, { sort: { 'createdAt': -1 } })
                        .populate('suggestions', '_id description createdAt', null, { sort: { 'createdAt': -1 } })
      return res.json({ status: true, staffs: staffs })
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
    res.json({ status: true })
    let m = yield Message.findOne({ _id: message._id }).populate('staff', 'fullname').populate('venue', 'name').populate('sender', '_id isStaff isVenue')
    yield notify.newMessage(m)
  }

  * sendInitialMsg (req, res) {
    let staff = yield Staff.findOne({ _id: req.input('staff', '') })
    let message = yield Message.create({
      sender: req.user._id,
      receiver: req.input('receiver'),
      message: req.input('message'),
      staff: staff._id,
      venue: req.user.venueId._id
    })
    let thread = {
      _id: message.conversation,
      latest: message.createdAt,
      message: message.message,
      delivered: message.delivered,
      seen: message.seen,
      usid: req.input('receiver'),
      uselect: staff._id,
      uname: staff.fullname,
      uavatar: staff.avatar
    }
    res.json({ status: true, thread: thread })
  }

  * myStaffs (req, res) {
    let managements = yield StaffManagement.find({ venue: req.user.venueId._id, trial: false }).populate('staff')
    let positions = ['bartender', 'manager', 'waiter', 'chef', 'kitchen', 'barback', 'host']
    let staffs = {}
    for (let position of positions) {
      staffs[position] = managements.filter((management) => {
        return (management.staff.position.includes(position))
      })
    }
    return res.json({ status: true, staffs, total: managements.length })
  }

}

module.exports = VenueController
