'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed


let eventSchema = mongoose.Schema({

  name: String,
  description: String,
  date: Date,
  time: {
    start: String,
    end: String
  },
  type: [String],
  staffInterest: [{ type: Mixed, default: {} }],
  image: { type: String, default: 'http://orientindia.com/admin//130/event_cover/5_event_management.jpg' },
  venueId: { type: ObjectId, ref: 'Venue' },
  organizerId: { type: ObjectId, ref: 'Organizer' },
  isVenue: { type: Boolean, default: false },
  isOrganizer: { type: Boolean, default: false },

  interested: { type: Mixed, default: {} },

  activeStaff: { type: Mixed, default: {} },

  updatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }

}, {
  versionKey: false
});


eventSchema.statics.rules = {
  name: 'required',
  description: 'required',
  time: 'required',
  date: 'required'
}

eventSchema.statics.messages = {
  'name.required': 'Name is required',
  'description.required': 'Description is required',
  'time.required': 'Start & end time is required',
  'date.required': 'Event date is required'
}


module.exports = mongoose.model('Event', eventSchema)
