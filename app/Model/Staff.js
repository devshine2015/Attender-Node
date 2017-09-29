'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed


let staffSchema = mongoose.Schema({

  user: { type: ObjectId, ref: 'User' },
  fullname: String,
  email: { type: String, unique: true, index: true },
  mobile: String,
  bio: String,
  summary: String,
  description: [String],
  birthdate: Date,
  gender: String,
  languages: [String],

  location: String,
  address: String,
  city: String,
  country: String,
  state: String,
  zip: String,

  position: [String],
  responseRate: Number,

  frequency: String,
  eligibility: String,
  startRate: { type: String, default: 10},
  endRate: { type: String, default: 15},

  rateBadge: String,
  rateType: { type: String, default: 'hourly'},
  ratings: Number,

  preferredLocation: String,
  preferredDistance: String,

  availability: { type: Mixed, default: {} },
  qualifications: [String],

  skills: { type: Mixed, default: {} },
  experiences: [{ type: Mixed, default: {} }],
  certificates: [String],
  licenses: [String],
  videos: [String],

  avatar: { type: String, default: 'https://www.jamf.com/jamf-nation/img/default-avatars/generic-user-purple.png' },

  updatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }

}, {
  versionKey: false
});

staffSchema.statics.rules = {
  mobile: 'required|max:50',
  fullname: 'required|alpha_numeric|min:5|max:45',
}

module.exports = mongoose.model('Staff', staffSchema)
