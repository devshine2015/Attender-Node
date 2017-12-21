'use strict'

const Command = use('Command')
const User = use('App/Model/User')
const Venue = use('App/Model/Venue')
const Organizer = use('App/Model/Organizer')
const Employer = use('App/Model/Employer')
const StaffManagement = use('App/Model/StaffManagement')
const Event = use('App/Model/Event')
const Task = use('App/Model/Task')
const StaffRating = use('App/Model/StaffRating')
const Timesheet = use('App/Model/Timesheet')
const Suggestion = use('App/Model/Suggestion')
const VenueNotification = use('App/Model/VenueNotification')
const EmployerNotification = use('App/Model/EmployerNotification')


class Migration extends Command {

  get signature () {
    return 'migrate-employer'
  }

  get description () {
    return 'Migrate venue / oganiser data to employer'
  }

  * handle (args, options) {
    this.info(`Starting migration ...`)
    let updated = 0,
        errors = 0,
        organizers = 0,
        venues = 0

    let users = yield User.find({ isVenue: true, isOrganizer: true })
                          .populate('venueId')
                          .populate('organizerId')

    for (let user of users) {
      let employer = yield Employer.create({
        user: user._id,
        isOrganizer: user.isOrganizer,
        isVenue: user.isVenue
      })
      user.isEmployer = true
      user.employer = employer._id
      yield user.save()

      if (employer.isVenue) {
        employer.name = user.venueId.name
        employer.managerName = user.venueId.managerName
        employer.type = user.venueId.type
        employer.location = user.venueId.location
        employer.info = user.venueId.info
        employer.tag1 = user.venueId.tag1
        employer.tag2 = user.venueId.tag2
        employer.image = user.venueId.image
        employer.locationName = user.venueId.locationName
        employer.openingHours = user.venueId.openingHours
        employer.numberEmployees = user.venueId.numberEmployees
        employer.services = user.venueId.services
        employer.socialMedia = user.venueId.socialMedia
        employer.calendar = user.venueId.calendar
        employer.interested = user.venueId.interested
        employer.staffs = user.venueId.staffs
        yield employer.save()
        console.log('Employer => venue', employer.name, employer._id)
        updated += 1
        venues += 1

        let managements = yield StaffManagement.find({ venue: user.venueId._id })
        for (let management of managements) {
          management.employer = employer._id
          yield management.save()
        }

        let events = yield Event.find({ venueId: user.venueId._id })
        for (let event of events) {
          event.employer = employer._id
          yield event.save()
        }

        let timesheets = yield Timesheet.find({ venue: user.venueId._id })
        for (let timesheet of timesheets) {
          timesheet.employer = employer._id
          yield timesheet.save()
        }

        let tasks = yield Task.find({ venue: user.venueId._id })
        for (let task of tasks) {
          task.employer = employer._id
          yield task.employer.save()
        }

        let ratings = yield StaffRating.find({ venue: user.venueId._id })
        for (let rating of ratings) {
          rating.employer = employer._id
          yield rating.employer.save()
        }

        let notifications = yield VenueNotification.find({ venueId: user.venueId._id })
        for (let notification of notifications) {
          yield EmployerNotification.create({
            staffId: notification.staffId,
            type: notification.type,
            eventId: notification.eventId,
            opened: notification.opened,
            viewed: notification.viewed,
            viewedAt: notification.viewedAt,
            isArchived: notification.isArchived,
            archivedAt: notification.archivedAt,
            employer: employer._id
          })
        }

      } else if (employer.isOrganizer) {
        employer.name = user.organizerId.name
        employer.isCompany = user.organizerId.name
        employer.companyName = user.organizerId.name
        employer.location = user.organizerId.name
        employer.locationName = user.organizerId.name
        employer.about = user.organizerId.name
        employer.eventType = user.organizerId.name
        employer.image = user.organizerId.name
        yield employer.save()
        console.log('Employer => organizer', employer.name, employer._id)
        updated += 1
        organizers += 1
      } else {
        console.log('WARNING: INVAID PROFILE', user._id)
        errors += 1
      }

    }
    console.log('Total Updated', updated)
    console.log('Total Errors', errors)
    console.log('Total Organizers', organizers)
    console.log('Total Venues', venues)
    process.exit(1)
  }

}


module.exports = Migration
