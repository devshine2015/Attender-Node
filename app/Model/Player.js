'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const playerSchema = mongoose.Schema({
  userId: { type: ObjectId, ref: 'User', index: true },
  playerId: { type: String, index: true },
},{
  timestamps: true
})

playerSchema.index({ userId: 1, playerId: 1 }, { unique: true });

module.exports = mongoose.model('Player', playerSchema)
