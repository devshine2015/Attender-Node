'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed


let organizerSchema = mongoose.Schema({

  user: { type: ObjectId, ref: 'User' },
  name: String,
  isCompany: { type: Boolean, default: false },
  companyName: { type: String, default: '' },
  location: {
    index: '2d',
    type: [Number]
  },
  locationName: String,
  about: String,
  eventType: [String],
  image: String,

  updatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }

}, {
  versionKey: false
});



module.exports = mongoose.model('Organizer', organizerSchema)
