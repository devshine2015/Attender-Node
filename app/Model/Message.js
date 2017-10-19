'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed
const moment = require('moment')
const Ws = use('Ws')
const chatChannel = Ws.channel('chat')


let messageSchema = mongoose.Schema({
  sender: { type: ObjectId, ref: 'User' },
  receiver: { type: ObjectId, ref: 'User'},
  staff: { type: ObjectId, ref: 'Staff'},
  venue: { type: ObjectId, ref: 'Venue' },
  conversation: String,
  message: String,
  delivered: { type: Boolean, default: false},
  seen: { type: Boolean, default: false },
  seenAt: Date,
  sentAt: { type: Date, default: Date.now },
  archived: { type: Boolean, default: false }
})

messageSchema.pre('save', function(next) {
  if (!this.conversation) {
    let sorted = [this.sender.toString(), this.receiver.toString()].sort()
    this.conversation = _hash(sorted[0] + sorted[1])
  }
  next()
})

messageSchema.post('save', function(msg){
  chatChannel.inRoom(msg.sender.toString()).emit('message', 'refresh-thread')
  chatChannel.inRoom(msg.receiver.toString()).emit('message', 'refresh-thread')
  chatChannel.inRoom(msg.conversation.toString()).emit('message', 'refresh-messages')
})

let _hash = (s) => {
    var a = 1, c = 0, h, o;
    if (s) {
        a = 0;
        for (h = s.length - 1; h >= 0; h--) {
            o = s.charCodeAt(h);
            a = (a<<6&268435455) + o + (o<<14);
            c = a & 266338304;
            a = c!==0?a^c>>21:a;
        }
    }
    return String(a)
}

module.exports = mongoose.model('message', messageSchema)
