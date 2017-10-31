'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

let bankSchema = mongoose.Schema({
  promiseId: String,
  active: Boolean,
  currency: String,
  verification: String,
  bankMeta: { type: Mixed, default: {} },
  user: { type: ObjectId, ref: 'User' },
  primary: Boolean
},{
  timestamps: true
})

module.exports = mongoose.model('Bank', bankSchema)
