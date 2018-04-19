'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const defaultPaymentMethodSchema = mongoose.Schema({
  userId: { type: ObjectId, ref: 'User', index: true, unique: true },
  method: String,
  number: String,
  promiseID: String,
},{
  timestamps: true
});

module.exports = mongoose.model('DefaultPaymentMethod', defaultPaymentMethodSchema)
