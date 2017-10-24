'use strict'
const Message = use('App/Model/Message')
const Staff = use('App/Model/Staff')
const Task = use('App/Model/Task')
const Suggestion = use('App/Model/Suggestion')
const StaffRating = use('App/Model/StaffRating')
const StaffManagement = use('App/Model/StaffManagement')
const Validator = use('Validator')
const moment = require('moment')


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

  * index (req, res) {
    let positions = req.input('positions', false)
    let staffs = yield Staff.find({}).populate('user', '_id fullname email mobile staffId')
    if (positions) {
      positions = positions.split(',')
      staffs = staffs.filter((staff) => {
          for (let position of positions) {
            let i = staff.position.indexOf(position)
            if (i >= 0) {
              return true
            }
          }
      })
    }
    res.json({ status: true, staffs: staffs, messageCode: 'SUCCESS' })
  }

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

  * sendVenueMsg (req, res) {
    let message = yield Message.create({
      sender: req.user._id,
      receiver: req.input('receiver'),
      message: req.input('message'),
      staff: req.user.staffId._id,
      venue: req.input('venue', '')
    })
    return res.json({ status: true })
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
    let management = yield this.getManagement(req)
    let rating = yield StaffRating.create({
      staff: management.staff._id,
      venue: management.venue,
      overAll: req.input('overall', 0),
      review: req.input('review', ''),
      type: req.param('type')
    })
    let items = JSON.parse(req.input('items', '{}'))
    for (let item of items) {
      rating.items.push(item)
    }
    rating.markModified('items')
    rating.save()
    management.ratings.push(rating._id)
    management.markModified('ratings')
    management.save()
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
    let management = yield this.getManagement(req)
    let _event = yield Event.findOne({ _id: req.input('event_id') })
    if (management && _event) {
      _event.staffs.push(management._id)
      _event.markModified('staffs')
      _event.save()
      res.json({ status: true, event: _event })
    } else {
      res.json({ status: false, messageCode: 'NOT_FOUND' })
    }

  }

}

module.exports = StaffController
