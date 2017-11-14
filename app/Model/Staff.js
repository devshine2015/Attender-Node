'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed
const VenueNotification = use('App/Model/VenueNotification')

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
  startRate: { type: Number, default: 8},
  endRate: { type: Number, default: 10},

  rateType: { type: String, default: 'hourly'},
  ratings: [{
    ratedby: { type: ObjectId, ref: 'Venue' },
    rating: Number,
    ratedAt: { type: Date, default: Date.now }
  }],

  preferredLocation: String,
  preferredDistance: String,

  availability: { type: Mixed, default: {} },
  qualifications: [String],

  skills: { type: Mixed, default: {} },
  experiences: [{ type: Mixed, default: {} }],
  certificates: [String],
  licenses: [String],
  videos: [String],

  avatar: { type: String, default: 'https://randomuser.me/api/portraits/men/71.jpg' },

  updatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }

}, {
  versionKey: false
})
staffSchema.set('toObject', { getters: true, virtuals: true })
staffSchema.set('toJSON', { getters: true, virtuals: true })

let rating = staffSchema.virtual('rating')
rating.get(function() {
  if (typeof(this.ratings) != 'undefined') {
    if (this.ratings.length > 0) {
      let total = this.ratings.reduce(function(a,b) {
          return { rating: a.rating + b.rating }
      })
      let rating = total.rating / this.ratings.length
      return { star: Math.floor( (rating * 100) / 100 ), label: rating.toFixed(2) }
    }
  } else {
    return { star: 0, label: 0 }
  }
})

let rateBadge = staffSchema.virtual('rateBadge')
rateBadge.get(function() {
  return `$${this.startRate}/hr - $${this.endRate}/hr`
})

staffSchema.statics.rules = {
  mobile: 'required|max:50',
  fullname: 'required|alpha_numeric|min:5|max:45',
}
staffSchema.post('remove', function(staff) {
  VenueNotification.remove({ staffId: staff._id }, function(err){})
})

module.exports = mongoose.model('Staff', staffSchema)
