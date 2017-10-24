'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed
const moment = require('moment')


let staffManagementSchema = mongoose.Schema({
  staff: { type: ObjectId, ref: 'Staff' },
  venue: { type: ObjectId, ref: 'Venue' },
  trial: { type: Boolean, default: true },
  trialPeriod: { type: Number, default: 7 },
  trialStartDate: { type: Date },
  trialEndDate: { type: Date },
  hired: { type: Boolean, default: false },
  hiredDate: Date,
  tasks: [{ type: ObjectId, ref: 'Task' }],
  suggestions: [{ type: ObjectId, ref: 'Suggestion' }],
  ratings: [{ type: ObjectId, ref: 'StaffRating' }],
  schedules: [{ type: Mixed, default: {} }]

  
})

staffManagementSchema.index({ staff: 1, venue: 1 }, { unique: true })

module.exports = mongoose.model('StaffManagement', staffManagementSchema)
