'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed
const moment = require('moment')

let taskSchema = mongoose.Schema({
  staff: { type: ObjectId, ref: 'Staff' },
  employer: { type: ObjectId, ref: 'Employer' },
  venue: { type: ObjectId, ref: 'Venue' },
  date: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  description: String
}, {
  timestamps: true
})


module.exports = mongoose.model('Task', taskSchema)
