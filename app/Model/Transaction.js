'use strict'

const mongoose = use('Mongoose')
const randomstring = require("randomstring")
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed


let transactionSchema = mongoose.Schema({
  sender: { type: ObjectId, ref: 'User' },
  receiver: { type: ObjectId, ref: 'User' },
  type: { type: String, enum: ['transfer', 'withdraw', 'deposit'] },
  amount: { type: Number, default: 0 },
  completedAt: Date,
  status: { type: String, enum: ['success', 'failed', 'pending'] },
  accountId: String
},{
  timestamps: true
})


 module.exports = mongoose.model('Transaction', transactionSchema)
