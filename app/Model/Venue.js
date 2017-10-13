'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed
const Staff = use('App/Model/Staff')

let venueSchema = mongoose.Schema({

  user: { type: ObjectId, ref: 'User' },
  name: String,
  managerName: String,
  type: [String],
  location: {
    index: '2d',
    type: [Number]
  },
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
      staffs.push(staff)
  }
  return staffs
})

module.exports = mongoose.model('Venue', venueSchema)
