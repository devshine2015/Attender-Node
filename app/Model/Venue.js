'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed
const Staff = use('App/Model/Staff')
const Event = use('App/Model/Event')
const StaffManagement = use('App/Model/StaffManagement')
const VenueNotification = use('App/Model/VenueNotification')

let venueSchema = mongoose.Schema({

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
  updatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }

}, {
  versionKey: false
});

let mystaffs = venueSchema.virtual('myStaffs')
mystaffs.get(function(){
  let staffs = []
  for (let staff in this.interested) {
      if (this.interested[staff].include) {
        staffs.push(staff)
      }
  }
  return staffs
})

venueSchema.post('remove', function(venue) {
  Event.remove({ venueId: venue._id }, function(err){})
  VenueNotification.remove({ venueId: venue._id }, function(err){})
  StaffManagement.remove({ venue: venue._id }, function(err){})
})

module.exports = mongoose.model('Venue', venueSchema)
