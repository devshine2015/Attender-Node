'use strict'

const Command = use('Command')
const Hash = use('Hash')
const Staff = use('App/Model/Staff')

class UpdateRates extends Command {

  get signature () {
    return 'update-rates'
  }

  get description () {
    return 'Update start and end rate of a staff'
  }

  * handle (args, options) {
    let staffs = yield Staff.find({})
    for (let staff of staffs) {
      staff.startRate = parseInt(staff.startRate.toString().replace('/', '').replace('$', '').replace('hr', ''))
      staff.endRate = parseInt(staff.endRate.toString().replace('/', '').replace('$', '').replace('hr', ''))
      yield staff.save()

    }
    process.exit(1)
  }

}

module.exports = UpdateRates
