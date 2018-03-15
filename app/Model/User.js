'use strict'

const mongoose = use('Mongoose')
const PromisePay = use('PromisePay')
const Staff = use('App/Model/Staff')
// const Message = use('App/Model/Message')
const StaffManagement = use('App/Model/StaffManagement')
const randomstring = require("randomstring")
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed
const Env = use('Env')


let userSchema = mongoose.Schema({
  fullname: String,
  email: { type: String, unique: true},
  mobile: { type: String },
  password: String,
  isSocialLogin: { type: Boolean, default: false},
  googleAuth: { type: Mixed, default: {} },
  facebookAuth: { type: Mixed, default: {} },
  isStaff: { type: Boolean, default: false},
  staffId: { type: ObjectId, ref: 'Staff'},

  isEmployer: { type: Boolean, default: false },
  employer: { type: ObjectId, ref: 'Employer' },


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
  createdAt: { type: Date, default: Date.now },
  promiseId: { type: String, default: '' }

}, {
  versionKey: false
});

userSchema.statics.rules = {
  mobile: 'required|max:50',
  displayName: 'required|alpha_numeric|min:6|max:20',
  email: 'required|email'
}

userSchema.statics.loginRules = {
  password: 'required',
  email: 'required'
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

userSchema.statics.facebookSchema = {
  id: 'required',
  name: 'required',
  gender: 'required',
  accessToken: 'required'
}
userSchema.post('save', function(user){
  let promiseId = `${Env.get('PROMISE_ID_PREFIX', 'beta-v1-acc-')}${user._id}`
  if (!user.promisePay) {
          PromisePay.createUser({
              id: promiseId,
              email: user.email,
              first_name: user.fullname,
              country: 'AUS'
          }).then((res)=>{
              user.promisePay = true
              user.promiseId = promiseId
              user.save()
          })
  }
  if (!user.walletId && user.promisePay) {
    PromisePay.wallet(user.promiseId).then((res)=>{
      user.walletId = res.wallet_accounts.id
      user.save()
    })
  }
})

userSchema.post('remove', function(user) {

 if (user.isStaff) {
   user.staffId.remove()
   StaffManagement.remove({ staff: user.staffId._id }, function(err){})
 }
 if (user.isVenue) {
   user.venueId.remove()
 }
 if (user.isOrganizer) {
   user.organizerId.remove()
 }
 // Message.remove({ $or: [ {receiver: user._id}, {sender: user._id}] }, function(err){})
})
userSchema.statics.visibleFields = ['fullname', 'email', 'mobile'].join(' ')


module.exports = mongoose.model('User', userSchema)
