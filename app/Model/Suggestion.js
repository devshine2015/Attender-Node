'use strict'
const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed
const moment = require('moment')

let suggestionSchema = mongoose.Schema({
  staff: { type: ObjectId, ref: 'Staff' },
  venue: { type: ObjectId, ref: 'Venue' },
  date: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  description: String
}, {
  timestamps: true
})

module.exports = mongoose.model('Suggestion', suggestionSchema)
