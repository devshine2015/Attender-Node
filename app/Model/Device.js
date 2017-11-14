'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

let deviceSchema = mongoose.Schema({
  token: { type: String, unique: true, indexed: true },
  type: { type: String, enum: ['ios', 'android'] },
  user: { type: ObjectId, ref: 'User' },
  info: { type: Mixed, default: {} },
  notification: { type: Boolean, default: true },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
})

module.exports = mongoose.model('Device', deviceSchema)
