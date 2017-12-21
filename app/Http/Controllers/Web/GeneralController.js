'use strict'
const User = use('App/Model/User')
const Message = use('App/Model/Message')
const moment = require('moment')

class GeneralController {

  * index (req, res) {
    yield res.sendView('web/master', { welcome: true })
  }

  * messages (req, res) {
    yield res.sendView('web/message/index')
  }

  * conversation (req, res) {
    let messages = yield Message
                        .find({ conversation: req.param('convo', ''), $or: [ {receiver: req.user._id}, {sender: req.user._id}] })
                        .populate('staff', '_id fullname')
                        .populate('venue', '_id name')

    return res.json({ status: true, messages: messages })
  }

  * sendStaffMsg (req, res) {
    let message = yield Message.create({
      sender: req.user._id,
      receiver: req.input('receiver'),
      message: req.input('message'),
      staff: req.input('staff', ''),
      employer: req.user.employer
    })
    return res.json({ status: true })
  }

  * sendVenueMsg (req, res) {
    let message = yield Message.create({
      sender: req.user._id,
      receiver: req.input('receiver'),
      message: req.input('message'),
      staff: req.user.staffId,
      venue: req.input('venue', '')
    })
    return res.json({ status: true })
  }

}

module.exports = GeneralController
