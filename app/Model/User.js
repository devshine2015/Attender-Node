'use strict'

const mongoose = use('Mongoose')
const randomstring = require("randomstring")
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed
const PromisePay = use('PromisePay')

let userSchema = mongoose.Schema({
  fullname: String,
  email: { type: String, unique: true},
  mobile: { type: String},
  password: String,
  isSocialLogin: { type: Boolean, default: false},
  googleAuth: { type: Mixed, default: {} },
  facebookAuth: { type: Mixed, default: {} },
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
  forgotkey: String,
  forgotActive: { type: Boolean, default: false },

  walletId: { type: String, default: '' },
  primaryAccount: { type: String, default: '' },
  promisePay: { type: Boolean, default: false },
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
  password: 'required|alpha_numeric|min:6|max:20'
}

userSchema.statics.registerRules = {
  fullname: 'required|string|max:255',
  email:    'required|email|min:5|max:50',
  password: 'required|string|min:6|max:20',
  mobile:   'required|max:50',
}
userSchema.statics.googleSchema = {
  id: 'required',
  idToken: 'required',
  accessToken: 'required',
  email: 'required',
  name: 'required',
  givenName: 'required',
  familyName: 'required',
  accessTokenExpirationDate: 'required'
}
// userSchema.post('save', function(user){
//   if (!user.walletId) {
//     let wallet = yield PromisePay.wallet(user._id)
//     user.walletId = wallet.wallet_accounts.id
//     user.save()
//   }
//   if (!user.promisePay) {
//     yield PromisePay.createUser({
//       id: user._id,
//       email: user.email,
//       first_name: user.fullname,
//       country: 'AUS'
//     })
//     user.promisePay = true
//     user.save()
//   }
// })
userSchema.statics.visibleFields = ['fullname', 'email', 'mobile'].join(' ')

module.exports = mongoose.model('User', userSchema)
