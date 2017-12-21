'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

let employerSchema = mongoose.Schema({

  user: { type: ObjectId, ref: 'User' },
  name: String,
  managerName: String,
  type: [String],
  location: {
    index: '2d',
    type: [Number]
  },
  info: String,
  tag1: String,
  tag2: String,
  image: { type: String, default: 'https://www.scandichotels.com/imagevault/publishedmedia/suw58cmdyrxfvvjep2a5/Scandic-Malmen-Interior-bar-Lilla-hotellbaren-over.jpg' },
  locationName: String,
  openingHours: { type: Mixed, default: {} },
  numberEmployees: Number,
  services: [String],
  socialMedia: { type: Mixed, default: {} },
  calendar: { type: Mixed, default: {} },
  interested: { type: Mixed, default: {} },
  staffs: { type: Mixed, default: {} },

  about: String,
  eventType: [String],
  isCompany: { type: Boolean, default: false },
  companyName: { type: String, default: '' },


  isOrganizer: { type: Boolean, default: false },
  isVenue: { type: Boolean, default: false }

}, {
  versionKey: false,
  timestamps: true
})

module.exports = mongoose.model('Employer', employerSchema)
