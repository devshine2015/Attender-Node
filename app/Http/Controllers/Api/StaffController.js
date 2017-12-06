'use strict'
const Venue = use('App/Model/Venue')
const Message = use('App/Model/Message')
const Staff = use('App/Model/Staff')
const Task = use('App/Model/Task')
const Suggestion = use('App/Model/Suggestion')
const StaffRating = use('App/Model/StaffRating')
const StaffManagement = use('App/Model/StaffManagement')
const Validator = use('Validator')
const moment = require('moment')
const Notify = use('App/Serializers/Notify')

let notify = new Notify()

class StaffController {

  * getManagement (req) {
    let management = yield StaffManagement.findOne({ _id: req.param('id') }).populate('staff')
    if (management) {
      return management
    }
  }

  * getTask (req) {
    let task = yield Task.findOne({ _id: req.param('id') })
    if (task) {
      return task
    }
  }

  * getSuggestion (req) {
    let suggestion = yield Suggestion.findOne({ _id: req.param('id') })
    if (suggestion) {
      return suggestion
    }
  }

  * getStaff (req) {
    return yield Staff.findOne({ _id: req.param('id') }).populate('user', '_id fullname')
  }

  * myManagements (req, res) {
    let managements = yield StaffManagement.find({ staff: req.user.staffId._id }).populate('venue', '_id name location locationName services type')
    return res.json({ status: true, managements })
  }

  * showStaff (req, res) {
    let staff = yield this.getStaff(req)
    if (staff) {
      return res.json({ status: true, staff })
    } else {
      return res.json({ status: false, messageCode: 'NOT_FOUND' })
    }
  }

  * getManagements (req, res) {
    let staff = yield this.getStaff(req)
    if (staff) {
      let managements = yield StaffManagement.find({ staff: staff._id, hired: true }).populate('venue')
      if (managements) {
        return res.json({ status: true, managements })
      } else {
        return res.json({ status: false, messageCode: 'NO_AVAILABLE_MANAGEMENTS' })
      }
    } else {
      return res.json({ status: false, messageCode: 'NOT_FOUND' })
    }
  }

  * getReviews (req, res) {
    let staff = yield this.getStaff(req)
    if (staff) {
      let ratings = yield StaffRating.find({ staff: staff._id, type: 'monthly' }).populate('venue', '_id name image')
      if (ratings) {
        return res.json({ status: true, ratings })
      } else {
        return res.json({ status: false, messageCode: 'NO_AVAILABLE_RATINGS' })
      }
    } else {
      return res.json({ status: false, messageCode: 'NOT_FOUND' })
    }
  }

  * index (req, res) {
    let availabilities = req.input('availabilities', false),
             positions = req.input('positions', false),
                 hours = req.input('hours', false),
                staffs = []
    let rates = (hours) ? hours.split(',') : false

    if (positions) {
      staffs = yield Staff.find({ position: { $in: positions.split(',') } }).populate('user', '_id fullname email mobile staffId')
      return res.json({ status: true, staffs, messageCode: 'SUCCESS', filtered: true })
    } else {
      staffs = yield Staff.find({}).populate('user', '_id fullname email mobile staffId')
      return res.json({ status: true, staffs, messageCode: 'SUCCESS', filtered: false })
    }

  }
// startRate: { $lte: parseInt(rates[0]) }, endRate: { $gte: parseInt(rates[1]) }
  * select (req, res) {
    let staff = yield this.getStaff(req)
    res.json({ status: true, staff: staff })
  }

  * directHire (req, res) {
    let staff = yield this.getStaff(req)
    let venue = req.user.venueId
    let management = yield StaffManagement.create({
      staff: staff._id,
      venue: venue._id,
      trial: false,
      hired: true,
      hiredDate: moment().format()
    })
    let s = venue.interested[staff._id]
    if (s) {
      s.include = false
      venue.markModified('interested')
      venue.save()
    }
    return res.json({ status: true, management: management })
  }

  * hire (req, res) {
    let management = yield this.getManagement(req)
    management.hired = true
    management.trial = false
    management.hiredDate = moment().format()
    management.save()
    return res.json({ status: true, management: management })
  }

  * trial (req, res) {
    let staff = yield this.getStaff(req)
    let venue = req.user.venueId
    let management = yield StaffManagement.create({
      staff: staff._id,
      venue: venue._id,
      trialStartDate: moment().format(),
      trialEndDate: moment().add(7, 'days').format()
    })
    let s = venue.interested[staff._id]
    if (s) {
      s.include = false
      venue.markModified('interested')
      venue.save()
    }
    res.json({ status: true, management: management })
  }

  * removeStaff (req, res) {
    let management = yield this.getManagement(req)
    management.remove()
    res.json({ status: true, messageCode: 'SUCCESS' })
  }


  * sendVenueMsg (req, res) {
    let message = yield Message.create({
      sender: req.user._id,
      receiver: req.input('receiver'),
      message: req.input('message'),
      staff: req.user.staffId._id,
      venue: req.input('venue', '')
    })
    res.json({ status: true })
    let m = yield Message.findOne({ _id: message._id }).populate('staff', 'fullname').populate('venue', 'name').populate('sender', '_id isStaff isVenue')
    yield notify.newMessage(m)
  }

  * saveAssignment (req, res) {
    let management = yield this.getManagement(req)
    if (management) {
      let assignments = JSON.parse(req.input('assignments', JSON.stringify(management.assignments)))
      management.assignments = assignments
      management.markModified('assignments')
      management.save()
      return res.json({ status: true, management })
    } else {
      return res.json({ status: false, messageCode: 'NOT_FOUND' })
    }

  }

  * addTask (req, res) {
    let management = yield this.getManagement(req)
    let task = yield Task.create({
      staff: management.staff._id,
      venue: req.user.venueId._id,
      description: req.input('description', '')
    })
    management.tasks.push(task._id)
    management.save()
    res.json({ status: true, task: task, management: management })
  }

  * addSuggestion (req, res) {
    let management = yield this.getManagement(req)
    let suggestion = yield Suggestion.create({
      staff: management.staff._id,
      venue: req.user.venueId._id,
      description: req.input('description', '')
    })
    management.suggestions.push(suggestion._id)
    management.save()
    res.json({ status: true, suggestion: suggestion, management: management})
  }

  * addRating (req, res) {
    let overAll = req.input('overall', 0)
    let management = yield this.getManagement(req)
    let rating = yield StaffRating.create({
      staff: management.staff._id,
      venue: management.venue,
      overAll: overAll,
      review: req.input('review', ''),
      type: req.param('type')
    })
    let items = JSON.parse(req.input('items', '{}'))
    if (Object.keys(items).length > 0) {
      for (let item of items) {
        rating.items.push(item)
      }
      rating.markModified('items')
      rating.save()
    }
    management.ratings.push(rating._id)
    management.markModified('ratings')
    management.save()
    if (rating.type == 'monthly') {
      management.staff.ratings.push({
        rating: overAll,
        ratedBy: management.venue
      })
      management.staff.markModified('ratings')
      management.staff.save()
    }

    return res.json({ status: true, rating: rating, management: management })
  }

  * editRating (req, res) {
    let rating = yield StaffRating.findOne({ _id: req.param('id') })
    let items = JSON.parse(req.input('items', '{}')) || rating.items
    rating.overAll = req.input('overAll', rating.overAll)
    rating.items = items
    rating.markModified('items')
    rating.save()
    return res.json({ status: true, rating: rating })
  }

  * addStaffToEvent (req, res) {
    let staff = yield this.getStaff(req)
    let _event = yield Event.findOne({ _id: req.param('eid') })
    if (staff && _event) {
      _event.staffs.push(staff._id)
      _event.markModified('staffs')
      _event.save()
      res.json({ status: true, event: _event })
    } else {
      res.json({ status: false, messageCode: 'NOT_FOUND' })
    }
  }

  * removeStaffFromEvent (req, res) {
    let staff = yield this.getStaff(req)
    let _event = yield Event.findOne({ _id: req.param('eid') })
    if (management && _event ) {
      let index = _event.staffs.indexOf(staff._id)
      if (index > -1) {
        _event.staffs.splice(index, 1)
        _event.markModified('staffs')
        _event.save()
        return res.json({ status: true, event: _event })
      } else {
        return res.json({ status: false, messageCode: 'STAFF_NOT_EXIST_ON_EVENT' })
      }
    } else {
      return res.json({ status: false, messageCode: 'NOT_EXIST' })
    }
  }

  * saveStaffSchedule (req, res) {
    let management = yield this.getManagement(req)
    if (management) {
      management.schedules = JSON.parse(req.input('schedules', '{}'))
      management.markModified('schedules')
      management.save()
      return res.json({ status: true, messageCode: 'SUCCESS', management: management })
    } else {
      return res.json({ status: false, messageCode: 'NOT_FOUND' })
    }
  }

  * payStaff (req, res) {
    let management = yield this.getManagement(req)
    if (management) {

    }
  }

}

module.exports = StaffController
