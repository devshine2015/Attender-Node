'use strict'

const Staff = use('App/Model/Staff')
const Venue = use('App/Model/Venue')
const Message = use('App/Model/Message')
const moment = require('moment')


class MessageController {

  * conversation (req, res) {
    let messages = yield Message
                        .find({ conversation: req.param('convo', ''), $or: [ {receiver: req.user._id}, {sender: req.user._id}], hiddenTo: { $ne: req.user._id } })
                        .sort('-sentAt')
                        .populate('staff', '_id fullname avatar')
                        .populate('venue', '_id name image')
    res.json({ status: true, messages: messages })
    let message = yield Message.find({conversation: req.param('convo', ''), receiver: req.user._id, seen: false }).sort('-sentAt').limit(1)
    if (message.length > 0) {
      message[0].seen = true
      message[0].seenAt = moment().format()
      yield message[0].save()
    }

  }

  * deleteConversation (req, res) {
    let update = yield Message.update({ conversation: req.param('convo', '') }, { $push: { hiddenTo: req.user._id } }, { multi: true })
    return res.json({ status: true, messageCode: 'SUCCESS' })
  }

  * archiveConversation (req, res) {
    let update = yield Message.update({ conversation: req.param('convo', '') }, { $push: { archivedTo: req.user._id } }, { multi: true })
    return res.json({ status: true, messageCode: 'SUCCESS' })
  }

  * staffArchives (req, res) {
    let threads = yield Message.aggregate(
      {
        $match: { $or : [{ sender: req.user._id }, { receiver: req.user._id }], archivedTo: req.user._id }
      }, {
        $lookup : {
         from: 'venues',
         localField: 'venue',
         foreignField: '_id',
         as: 'venue'
        }
      }, {
        $unwind: '$venue'
      }, {
        $group: {
          _id: '$conversation',
          latest: { $last: '$sentAt' },
          message: { $last: '$message' },
          delivered: { $last: '$delivered' },
          seen: { $last: '$seen' },
          usid: { $last: '$venue.user'},
          uselect: { $last: '$venue._id' },
          uname: { $last: '$venue.name' },
          uavatar: { $last: '$venue.image'}
        }
      }, {
        $sort: { latest: -1 }
      }
    )
    res.json({ status: true, threads: threads })
  }

  * venueArchives (req, res) {
    let threads = yield Message.aggregate(
      {
        $match: { $or : [{ sender: req.user._id }, { receiver: req.user._id }], archivedTo: req.user._id }
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
  }

  * staffMessages (req, res) {
    let threads = yield Message.aggregate(
      {
        $match: { $or : [{ sender: req.user._id }, { receiver: req.user._id }], archivedTo: { $ne: req.user._id }, hiddenTo: { $ne: req.user._id } }
      }, {
        $lookup : {
         from: 'venues',
         localField: 'venue',
         foreignField: '_id',
         as: 'venue'
        }
      }, {
        $unwind: '$venue'
      }, {
        $group: {
          _id: '$conversation',
          latest: { $last: '$sentAt' },
          message: { $last: '$message' },
          delivered: { $last: '$delivered' },
          seen: { $last: '$seen' },
          usid: { $last: '$venue.user'},
          uselect: { $last: '$venue._id' },
          uname: { $last: '$venue.name' },
          uavatar: { $last: '$venue.image'},
          msgId: { $last: '$_id'}
        }
      }, {
        $sort: { latest: -1 }
      }
    )
    res.json({ status: true, threads: threads })
    for (let thread of threads) {
      let message = yield Message.findOne({ _id: thread.msgId, delivered: false, receiver: req.user._id })
      if(message) {
        message.delivered = true
        yield message.save()
      }
    }
  }

  * venueMessages (req, res) {
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
      },{
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
          uavatar: { $last: '$staff.avatar'},
          msgId: { $last: '$_id'}
        }
      },{
        $sort: { latest: -1 }
      }
    )
    res.json({ status: true, threads: threads })
    for (let thread of threads) {
      let message = yield Message.findOne({ _id: thread.msgId, delivered: false, receiver: req.user._id })
      if(message) {
        message.delivered = true
        yield message.save()
      }
    }
  }

  * restoreArchive (req, res) {
    let update = yield Message.update({ conversation: req.param('convo', '') }, { $pull: { archivedTo: req.user._id } }, { multi: true })
    return res.json({ status: true, messageCode: 'SUCCESS' })
  }

}


module.exports = MessageController
