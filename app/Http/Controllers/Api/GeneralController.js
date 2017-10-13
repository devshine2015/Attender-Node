'use strict'

const Message = use('App/Model/Message')


class GeneralController {

  * conversation (req, res) {
    let messages = yield Message
                        .find({ conversation: req.param('convo', ''), $or: [ {receiver: req.user._id}, {sender: req.user._id}] })
                        .sort('sentAt')
                        .populate('staff', '_id fullname')
                        .populate('venue', '_id name')

    return res.json({ status: true, messages: messages })
  }

}

module.exports = GeneralController
