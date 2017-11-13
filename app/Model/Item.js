'use strict'

const mongoose = use('Mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

let itemSchema = mongoose.Schema({
    promiseId: String,
    name: String,
    description: String,
    state: String,
    net_amount: Number,
    chargedback_amount: Number,
    refunded_amount: Number,
    released_amount: Number,
    buyer_fees: Number,
    seller_fees: Number,
    credit_card_fee: Number,
    paypal_fee: Number,
    direct_debit_fee: Number,
    status: Number,
    amount: Number,
    payment_type_id: Number,
    due_date: String,
    pending_release_amount: Number,
    deposit_reference: String,
    promisepay_fee: Number,
    total_outstanding: Number,
    total_amount: Number,
    currency: String,
    payment_method: String,
    buyer_name: String,
    buyer_email: String,
    buyer_country: String,
    seller_name: String,
    payment_credit_card_enabled: Boolean,
    payment_direct_debit_enabled: Boolean,
    related: {
      buyers: String,
      sellers: String
    },
    links: { type: Mixed, default: {} }
})

module.exports = mongoose.model('Item', itemSchema)
