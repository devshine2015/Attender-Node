'use strict'

const Message = use('App/Model/Message')
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

}

module.exports = GeneralController
