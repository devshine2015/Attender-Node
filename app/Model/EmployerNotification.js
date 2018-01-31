'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed


let employerNotificationSchema = mongoose.Schema({

  employer: { type: ObjectId, ref: 'Employer' },
  staffId: { type: ObjectId, ref: 'Staff' },
  type: { type: String, enum: ['message', 'event-interest', 'venue-interest', 'transaction', 'payment', 'hired', 'trial'] },
  eventId: { type: ObjectId, ref: 'Event'},
  timesheet: { type: ObjectId, ref: 'Timesheet'},
  paymentStatus: { type: String },
  opened: { type: Boolean, default: false },
  viewed: { type: Boolean, default: false },
  viewedAt: { type: Date },
  isArchived: { type: Boolean, default: false },
  archivedAt: { type: Date },

}, {
  versionKey: false,
  timestamps: true
})



module.exports = mongoose.model('EmployerNotification', employerNotificationSchema)
