'use strict'

const mongoose = use('Mongoose')
const randomstring = require("randomstring")
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

let userSchema = mongoose.Schema({
  fullname: String,
  email: { type: String, unique: true},
  mobile: { type: String, unique: true},
  password: String,
  facebookId: String,
  googleId: String,
  instagramId: String,
  isSocialLogin: { type: Boolean, default: false},

  isStaff: { type: Boolean, default: false},
  staffId: { type: ObjectId, ref: 'Staff'},

  isVenue: { type: Boolean, default: false},
  venueId: { type: ObjectId, ref: 'Venue' },

  isOrganizer: { type: Boolean, default: false },
  organizerId: { type: ObjectId, ref: 'Organizer' },

  isAdmin: { type: Boolean, default: false },
  adminId: String,

  adminToken: String,
  webToken: String,

  avatar: { type: String, default: 'https://randomuser.me/api/portraits/men/71.jpg' },
  isActive: { type: Boolean, default: false },
  rememberToken: String,
  emailToken: String,
  apiKey: String,

  token: { type: Mixed, default: {} },

  hasProfile: { type: Boolean, default: false },

  deviceIds: [String],

  verified: { type: Boolean, default: false },
  verification : { type: String, default: () => { return randomstring.generate() } },

  confirmed: { type: Boolean, default: false },

  updatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, {
  versionKey: false
});

userSchema.statics.rules = {
  mobile: 'required|max:50',
  displayName: 'required|alpha_numeric|min:6|max:20',
  email: 'required|email'
}

userSchema.statics.loginRules = {
  email: 'required|email|min:5|max:50',
  password: 'required|alpha_numeric|min:6|max:20'
}

userSchema.statics.registerRules = {
  fullname: 'required|string|max:255',
  email:    'required|email|min:5|max:50',
  password: 'required|string|min:6|max:20',
  mobile:   'required|max:50',
}

userSchema.statics.visibleFields = ['fullname', 'email', 'mobile'].join(' ')

module.exports = mongoose.model('User', userSchema)
