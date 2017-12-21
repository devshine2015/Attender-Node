'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed
const moment = require('moment')
// const Ws = use('Ws')
// const chatChannel = Ws.channel('chat')
const _hash = require('../Serializers/BaseHash');

let messageSchema = mongoose.Schema({
  sender: { type: ObjectId, ref: 'User' },
  receiver: { type: ObjectId, ref: 'User'},
  staff: { type: ObjectId, ref: 'Staff'},
  venue: { type: ObjectId, ref: 'Venue' },
  organizer: { type: ObjectId, ref: 'Orghanizer' },
  conversation: String,
  message: String,
  delivered: { type: Boolean, default: false},
  seen: { type: Boolean, default: false },
  seenAt: Date,
  sentAt: { type: Date, default: Date.now },
  archivedTo: [{ type: ObjectId, ref: 'User' }],
  hiddenTo: [{ type: ObjectId, ref: 'User' }],

  employer: { type: ObjectId, ref: 'Employer' },

})

messageSchema.pre('save', function(next) {
  if (!this.conversation) {
    let sorted = [this.sender.toString(), this.receiver.toString()].sort()
    this.conversation = _hash(sorted[0] + sorted[1])
  }
  next()
})

// messageSchema.post('save', function(msg) {
//   chatChannel.inRooms([msg.receiver.toString(),msg.sender.toString()]).emit('message', 'refresh-thread')
//   chatChannel.inRoom(msg.conversation.toString()).emit('message', 'refresh-messages')
// })




module.exports = mongoose.model('message', messageSchema)
