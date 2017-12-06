'use strict'

const Command = use('Command')
const Hash = use('Hash')

const User = use('App/Model/User')
const Staff = use('App/Model/Staff')
const Venue = use('App/Model/Venue')
const Organizer = use('App/Model/Organizer')
const Bank = use('App/Model/Bank')
const Card = use('App/Model/Card')
const Item = use('App/Model/Item')
const Event = use('App/Model/Event')
const StaffManagement = use('App/Model/StaffManagement')
const StaffRating = use('App/Model/StaffRating')
const Suggestion = use('App/Model/Suggestion')
const Task = use('App/Model/Task')
const Timesheet = use('App/Model/Timesheet')
const VenueNotification = use('App/Model/VenueNotification')
const Device = use('App/Model/Device')

class ResetDB extends Command {

  get signature () {
    return 'reset-db'
  }

  get description () {
    return 'Reset database collections'
  }

  * handle (args, options) {
    let confirm = yield this.confirm('Are you sure you want to reset collections?').print()
    if (confirm) {
      let collections = [User, Staff, Venue, Organizer, Bank, Card, Item, Event, StaffManagement, StaffRating, Suggestion, Task, Timesheet, VenueNotification, Device]
      for (let collection of collections) {
        let del = yield collection.remove({})
        console.log(del);
      }
      console.log('Finished!')
      process.exit(1)
    } else {
      console.log('Exit')
      process.exit(1)
    }
  }
}

module.exports = ResetDB
