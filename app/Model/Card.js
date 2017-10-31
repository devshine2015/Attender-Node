'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

let cardSchema = mongoose.Schema({
  promiseId: String,
  active: Boolean,
  currency: String,
  cardMeta: { type: Mixed, default: {} },
  user: { type: ObjectId, ref: 'User' },
  primary: Boolean
},{
  timestamps: true
})


module.exports = mongoose.model('Card', cardSchema)
