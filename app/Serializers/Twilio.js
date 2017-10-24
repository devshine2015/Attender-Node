'use strict'
const accountSid = 'AC5385b0414e8e33c662cf3996a32a9342'
const authToken = 'c24fcf5ec9efb25f4dd49228264175bc'
const client = require('twilio')(accountSid, authToken)

module.exports = {

  validateNumber: (number) => {
    let find = client.lookups.v1.phoneNumbers(number).fetch()
    return find
  }

}
