'use strict'

const mongoose = use('Mongoose')
const moment = require('moment')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed


let timesheetSchema = mongoose.Schema({

  staff: { type: ObjectId, ref: 'Staff' },
  venue: { type: ObjectId, ref: 'Venue' },
  management: { type: ObjectId, ref: 'StaffManagement' },
  weekStart: { type: Date },
  weekEnd: { type: Date },
  days: [{
    date: Date,
    isoWeekPeriod: String,
    schedules: [{
      break: { type: Number, default: 0 },
      payableHours: { type: Number, default: 0 },
      startTime: { type: String, default: '' },
      endTime: { type: String, default: '' }
    }]
  }],
  totalPayableHours: Number,
  rate: Number,
  paymentStatus: { type: String, enum: ['unpaid', 'pending', 'failed', 'paid'], default: 'unpaid' },
  transactionId: String,
  mutable: { type: Boolean, default: true }

}, {
  timestamps: true
})

timesheetSchema.set('toObject', { getters: true, virtuals: true })
timesheetSchema.set('toJSON', { getters: true, virtuals: true })

let active = timesheetSchema.virtual('active')
active.get(function() {
  let day = moment()
  return (day >= this.weekStart && day < this.weekEnd)
})


let label = timesheetSchema.virtual('label')
label.get(function() {
  if (this.weekStart.getMonth() != this.weekEnd.getMonth()) {
    return  `${moment(this.weekStart).format('MMM D')} - ${moment(this.weekEnd).format('MMM D YYYY')}`
  } else {
    return `${moment(this.weekStart).format('MMMM D')}-${moment(this.weekEnd).format('D YYYY')}`
  }
})

module.exports = mongoose.model('Timesheet', timesheetSchema)
