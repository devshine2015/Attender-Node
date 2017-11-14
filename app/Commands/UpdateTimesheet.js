'use strict'

const Command = use('Command')
const AHelpers = use('AHelpers')
const Timesheet = use('App/Model/Timesheet')
const StaffManagement = use('App/Model/StaffManagement')
const moment = require('moment')

class UpdateTimeSheets extends Command {

  get signature () {
    return 'update-timesheets'
  }

  get description () {
    return 'Update Timesheets'
  }

  * handle (args, options) {
    console.log('Loading data...')
    let weekStart = moment().startOf('isoWeek')
    let updated = 0,
        existed = 0
    let managements = yield StaffManagement.find({})
    for (let management of managements) {
      let exist = yield Timesheet.findOne({ management: management._id, weekStart: weekStart })
      if (!exist) {
        let time = yield AHelpers.initializeTimesheet(management)
        let timesheet = yield Timesheet.create(time)
        console.log('Created New', timesheet._id)
        updated += 1
      } else {
        existed += 1
      }
    }
    console.log('Total', weekStart);
    console.log('New:', updated)
    console.log('Old:', existed)
    process.exit(1)
  }

}

module.exports = UpdateTimeSheets
