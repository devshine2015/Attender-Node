'use strict'

const Staff = use('App/Model/Staff')
const StaffManagement = use('App/Model/StaffManagement')
const Venue = use('App/Model/Venue')
const Message = use('App/Model/Message')
const moment = require('moment')


class MessageController {

  * conversation (req, res) {
    let messages = yield Message
                        .find({ conversation: req.param('convo', ''), $or: [ {receiver: req.user._id}, {sender: req.user._id}], hiddenTo: { $ne: req.user._id } })
                        .sort('-sentAt')
                        .populate('staff', '_id fullname avatar')
                        .populate('employer', '_id name image')
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
         from: 'employers',
         localField: 'employer',
         foreignField: '_id',
         as: 'employer'
        }
      }, {
        $unwind: '$employer'
      }, {
        $group: {
          _id: '$conversation',
          latest: { $last: '$sentAt' },
          message: { $last: '$message' },
          delivered: { $last: '$delivered' },
          seen: { $last: '$seen' },
          usid: { $last: '$employer.user'},
          uselect: { $last: '$employer._id' },
          uname: { $last: '$employer.name' },
          uavatar: { $last: '$employer.image'}
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
         from: 'employers',
         localField: 'employer',
         foreignField: '_id',
         as: 'employer'
        }
      }, {
        $unwind: '$employer'
      }, {
        $group: {
          _id: '$conversation',
          latest: { $last: '$sentAt' },
          message: { $last: '$message' },
          delivered: { $last: '$delivered' },
            seen: { $last: '$seen' },
            staffId: { $last: '$staff' },
          usid: { $last: '$employer.user'},
          uselect: { $last: '$employer._id' },
          uname: { $last: '$employer.name' },
          uavatar: { $last: '$employer.image'},
          msgId: { $last: '$_id'}
        }
      }, {
        $sort: { latest: -1 }
      }
    )
    console.log(threads)
    yield threads.map(function * (thread) {
        let staff = yield Staff.findOne({_id: thread.staffId}).populate('user', '_id fullname')
        thread['staff'] = (staff) ? staff : null
    })
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
            staffId: { $last: '$staff' },
          uselect: { $last: '$staff._id' },
          uname: { $last: '$staff.fullname' },
          uavatar: { $last: '$staff.avatar'},
          msgId: { $last: '$_id'},
          position: { $last: '$staff.position' },
        }
      },{
        $sort: { latest: -1 }
      }
    )

    yield threads.map(function * (thread) {
        let staff = yield Staff.findOne({_id: thread.staffId}).populate('user', '_id fullname')
        thread['staff'] = (staff) ? staff : null
    })
    // filter by position
    let positions = String(req.input('positions', '')).split(',')
    if (positions[0] != '') {
      threads = threads.filter((thread) => {
        for (let position of positions) {
          if (thread.position.includes(position)) {
            return true
          }
        }
      })
    }

    // fetch meta data
    yield threads.map(function * (thread) {
      let management = yield StaffManagement.findOne({ staff: thread.uselect, hired: true, employer: {$ne: null} }).populate('employer')
      thread['meta'] = (management) ? `${thread.position[0].capitalize()} ${(management.employer.isVenue) ? 'at' : 'of'} ${management.employer.name}` : null
    })

    res.json({ status: true, threads, positions })


    // update messages as delivered -- performance wise (update after sending response)
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
