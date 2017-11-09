'use strict'

const Staff = use('App/Model/Staff')
const Message = use('App/Model/Message')
const PromisePay = use('PromisePay')
const PushNotification = use('PushNotification')
const _hash = require('../../../Serializers/BaseHash');

class GeneralController {

  * conversation (req, res) {
    let messages = yield Message
                        .find({ conversation: req.param('convo', ''), $or: [ {receiver: req.user._id}, {sender: req.user._id}] })
                        .sort('-sentAt')
                        .populate('staff', '_id fullname avatar')
                        .populate('venue', '_id name image')

    return res.json({ status: true, messages: messages })
  }

  * openConvo (req, res) {

    let sorted = [req.user._id, req.param('id')].sort()
    let conversation = _hash(sorted[0] + sorted[1])
    let exist = yield Message.findOne({ conversation: conversation })
    return res.json({ status: true, exist: (exist) ? true : false, conversation: conversation })

  }

  * sendNotif (req, res) {
    let send = PushNotification.send({
      deviceToken: '60306944365c147d2e5077755ea0c2bc3fd356912f399a4d966ba758947ceac8',
      alert: req.input('message')
    })
    return res.json({ status: true, messageCode: 'SENT' })
  }


  * staffs (req, res) {
    let staffs = yield Staff.find({})
    return res.json({staffs})
  }
}

module.exports = GeneralController
