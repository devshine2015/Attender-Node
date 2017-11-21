'use strict'

const User = use('App/Model/User')
const Venue = use('App/Model/Venue')
const Message = use('App/Model/Message')
const Staff = use('App/Model/Staff')
const Task = use('App/Model/Task')
const Suggestion = use('App/Model/Suggestion')
const StaffManagement = use('App/Model/StaffManagement')
let moment = require('moment')


class StaffController {

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
    let staff = yield Staff.findOne({ _id: req.param('id') })
    if (staff) {
      return staff
    }
  }

  * getManagement (req) {
    let management = yield StaffManagement.findOne({ _id: req.param('id') })
    if (management) {
      return management
    }
  }

  * index (req, res) {
    let venue = yield Venue.findOne({ _id: req.user.venueId })
    let staffs = yield Staff.find({ _id: {$nin: venue.myStaffs}  }).populate('user', '_id')
    yield res.sendView('web/staff/index', { staffs: staffs })
  }

  * save (req, res) {

    let staff = yield Staff.create({
      user: req.user._id,
      email: req.user.email,
      mobile: req.user.mobile,
      fullname: req.input('fullname', ''),
      bio: req.input('bio', ''),
      description: req.input('description', []),
      gender: req.input('gender'),
      birthdate: new Date(req.input('birthdate')),
      preferredLocation: req.input('location'),
      preferredDistance: req.input('distance'),
      frequency: req.input('frequency'),
      position: req.input('positions', []),
      startRate: req.input('startRate', 10),
      endRate: req.input('endRate', 15),
      rateBadge: req.input('rateBadge'),
      rateType: req.input('rateType', 'hourly'),
      certificates: req.input('qualifications', []),
      availability: req.input('availability', {}),
      languages: req.input('languages', {}),
    })
    req.user.staffId = staff._id
    req.user.isStaff = true
    req.user.hasProfile = true
    req.user.save()

    res.json({ status: true, data: req.user })
  }

  * messages (req, res) {

    let threads = yield Message.aggregate(
      {
        $match: { $or : [{ sender: req.user._id }, { receiver: req.user._id }], archivedTo: { $ne: req.user._id }, hiddenTo: { $ne: req.user._id } }
      }, {
        $lookup : {
         from: 'venues',
         localField: 'venue',
         foreignField: '_id',
         as: 'venue'
        }
      }, {
        $unwind: '$venue'
      }, {
        $group: {
          _id: '$conversation',
          latest: { $last: '$sentAt' },
          message: { $last: '$message' },
          delivered: { $last: '$delivered' },
          seen: { $last: '$seen' },
          usid: { $last: '$venue.user'},
          uselect: { $last: '$venue._id' },
          uname: { $last: '$venue.name' },
          uavatar: { $last: '$venue.image'}
        }
      }, {
        $sort: { latest: -1 }
      }
    )
    res.json({ status: true, threads: threads })
    yield Message.update({ receiver: req.user._id, delivered: false }, { delivered: true }, { multi: true })

  }

  * trial (req, res) {
    let staff = yield this.getStaff(req)
    let venue = yield Venue.findOne({ _id: req.user.venueId })
    let management = yield StaffManagement.create({
      staff: staff._id,
      venue: req.user.venueId,
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

  * directHire (req, res) {
    let staff = yield this.getStaff(req)
    let venue = yield Venue.findOne({ _id: req.user.venueId })
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

  * addTask (req, res) {
    let management = yield this.getManagement(req)
    let task = yield Task.create({
      staff: management.staff,
      venue: req.user.venueId,
      description: req.input('description', '')
    })
    management.tasks.push(task._id)
    management.save()
    res.json({ status: true, task: task, management: management })
  }

  * editTask (req, res) {
    let task = yield this.getTask(req)
    task.description = req.input('description', task.description)
    task.save()
    return res.json({ status: true, task: task })
  }

  * deleteTask (req, res) {
    let task = yield this.getTask(req)
    task.remove()
    return res.json({ status: true })
  }

  * addSuggestion (req, res) {
    let management = yield this.getManagement(req)
    let suggestion = yield Suggestion.create({
      staff: management.staff,
      venue: req.user.venueId,
      description: req.input('description', '')
    })
    management.suggestions.push(suggestion._id)
    management.save()
    res.json({ status: true, suggestion: suggestion, management: management})
  }

  * editSuggestion (req, res) {
    let suggestion = yield this.getSuggestion(req)
    suggestion.description = req.input('description', suggestion.description)
    suggestion.save()
    return res.json({ status: true, suggestion: suggestion })
  }

  * deleteSuggestion (req, res) {
    let suggestion = yield this.getSuggestion(req)
    suggestion.remove()
    return res.json({ status: true })
  }

}

module.exports = StaffController
