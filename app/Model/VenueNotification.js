'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed


let venueNotificationSchema = mongoose.Schema({

  venueId: { type: ObjectId, ref: 'Venue' },
  staffId: { type: ObjectId, ref: 'Staff' },
  employer: { type: ObjectId, ref: 'Employer' },
  type: { type: String, enum: ['message', 'event-interest', 'venue-interest', 'transaction', 'payment'] },
  eventId: { type: ObjectId, ref: 'Event'},
  timesheet: { type: ObjectId, ref: 'Timesheet'},
  paymentStatus: { type: String },
  opened: { type: Boolean, default: false },
  viewed: { type: Boolean, default: false },
  viewedAt: { type: Date },
  isArchived: { type: Boolean, default: false },
  archivedAt: { type: Date },
  updatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }

}, {
  versionKey: false
});



module.exports = mongoose.model('VenueNotification', venueNotificationSchema)
