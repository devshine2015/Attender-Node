'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const history = mongoose.Schema({
  purchaseDate: { type: Date, index: true },
  expireDate: { type: Date, index: true },
  cancelDate: { type: Date, index: true, required: false },
  status: String,
})

const subscriptionSchema = mongoose.Schema({
  type: { type: String, index: true },
  employerId: { type: ObjectId, ref: 'Employer', index: true },
  staffId: { type: ObjectId, ref: 'Staff', index: true, required: false },
  purchaseDate: { type: Date, index: true },
  expireDate: { type: Date, index: true },
  cancelDate: { type: Date, index: true, required: false },
  status: String,
  history: { type: [history], usePushEach: true },
  price: Number
},{
  timestamps: true
})

subscriptionSchema.index({ employerId: 1, staffId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', subscriptionSchema)
