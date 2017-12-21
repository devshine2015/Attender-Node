'use strict'

const User = use('App/Model/User')
const Device = use('App/Model/Device')
const Item = use('App/Model/Item')
const Event = use('App/Model/Event')
const Staff = use('App/Model/Staff')
const Venue = use('App/Model/Venue')
const Message = use('App/Model/Message')
const Employer = use('App/Model/Employer')
const StaffManagement = use('App/Model/StaffManagement')
const Timesheet = use('App/Model/Timesheet')
const PromisePay = use('PromisePay')
const PushNotification = use('PushNotification')
const Notify = use('App/Serializers/Notify')
const _hash = require('../../../Serializers/BaseHash');
let notify = new Notify()

class GeneralController {

  * conversation (req, res) {
    let messages = yield Message
                        .find({ conversation: req.param('convo', ''), $or: [ {receiver: req.user._id}, {sender: req.user._id}], hiddenTo: { $ne: req.user._id } })
                        .sort('-sentAt')
                        .populate('staff', '_id fullname avatar')
                        .populate('employer', '_id name image')

    return res.json({ status: true, messages: messages })
  }

  * users (req, res) {
    let users = yield User.find({})
    return res.json({ users })
  }

  * pushVenueInterest (req, res) {
    let venue = yield Venue.findOne({ _id: req.param('venue') })
    let staff = yield Staff.findOne({ _id: req.param('staff') })
    yield notify.venueInterest(staff, venue)
    return res.json({ status: true })
  }

  * pushEventInterest (req, res) {
    let $event = yield Event.findOne({ _id: req.param('event') })
    let staff = yield Staff.findOne({ _id: req.param('staff') })
    yield notify.eventInterest(staff, $event)
    return res.json({ status: true })
  }

  * deviceList (req, res) {
    let devices = yield Device.find({}).populate('user', '_id fullname')
    return res.json({ devices })
  }

  * messages (req, res) {
    let messages = yield Message.find({})
    return res.json({ messages })
  }
  * pushMessage (req, res) {
    let m = yield Message.findOne({ _id: req.param('id') }).populate('staff', 'fullname').populate('employer', 'name').populate('sender', '_id isStaff isVenue')
    yield notify.newMessage(m)
    return res.json({ status: true, message: m })
  }

  * managements (req, res) {
    let managements = yield StaffManagement.find({}).populate('staff', '_id fullname position').populate('employer', '_id name')
    return res.json({ managements })
  }

  * timesheets (req, res) {
    let timesheets = yield Timesheet.find({}).populate('staff', '_id fullname position').populate('employer', '_id name')
    return res.json({ timesheets })
  }

  // staff - '5a01a8b12306d42411fb181e'
  // user - '5a01a8b02306d42411fb181d'

  // venue - '59f82f2057f2b322c2e715fa'
  // user - '59f82f2057f2b322c2e715f9'

  * openConvo (req, res) {
    let user = yield User.findOne({ _id: req.param('id') })
    if (user) {
      let trial = false,
          hired = false
      let sorted = [req.user._id, user._id].sort()
      let conversation = _hash(sorted[0] + sorted[1])
      let exist = yield Message.findOne({ conversation: conversation })
      if (user.isStaff) {
        let management = yield StaffManagement.findOne({ venue: req.user.employer._id, staff: user.staffId })
        if (management) {
          hired = management.hired
          trial = management.trial
        }
      }
      return res.json({ status: true, exist: (exist) ? true : false, conversation, trial, hired })
    } else {
      return res.json({ status: false, messageCode: 'USER_NOT_FOUND' })
    }

  }

  * sendNotif (req, res) {
    let send = yield PushNotification.sendIOS({
      deviceToken: req.input('deviceToken', '60306944365c147d2e5077755ea0c2bc3fd356912f399a4d966ba758947ceac8'),
      initialMessge: req.input('message', ''),
      fromNoti: 'Suc'
    })
    return res.json({ status: send })
  }

  * staffs (req, res) {
    let staffs = yield Staff.find({})
    return res.json({staffs})
  }

  * itemUpdates (req, res) {
    let itemUpdate = req.input('items', {})
    let item = yield Item.findOne({ promiseId: itemUpdate.id })
    if (!item) {
      let newItem = yield Item.create(itemUpdate)
      newItem.promiseId = itemUpdate.id
      yield newItem.save()
    } else {
      item.state = itemUpdate.state
      item.status = itemUpdate.status
      item.payment_method = itemUpdate.payment_method
      yield item.save()
      // vv
    }
    let timesheet = yield Timesheet.findOne({ transactionId: item.promiseId })
    if (timesheet) {
      switch (item.state) {
        case 'completed':
          timesheet.paymentStatus = 'paid'
          yield timesheet.save()
          break;
        case 'voided':
          timesheet.paymentStatus = 'failed'
          yield timesheet.save()
          break;
        case 'cancelled':
          timesheet.paymentStatus = 'cancelled'
          yield timesheet.save()
          break;
        default:
          //
      }
    }
    return res.json({ status: true })
  }

  * transactionUpdates (req, res) {
    console.log(req.all());
    return res.json({ status: true })
  }

  * items (req, res) {
    let items = yield Item.find({})
    return res.json({ items })
  }

}

module.exports = GeneralController
