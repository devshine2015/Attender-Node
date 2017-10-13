'use strict'
const Staff = use('App/Model/Staff')
const Validator = use('Validator')
const moment = require('moment')


class StaffController {

  * getStaff (req) {
    return yield Staff.findOne({ _id: req.param('id') }).populate('user')
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

  * hire (req, res) {
    let staff = yield this.getStaff(req)
    let venue = req.user.venueId
    venue.staffs[staff._id] = {
      trial: false,
      hired: true,
      hiredDate: moment(),
      ratings: null
    }
  }

  * trial (req, res) {
    let staff = yield this.getStaff(req)
    let venue = req.user.venueId
    venue.staffs[staff._id] = {
      trial: true,
      trialPeriod: 7,
      trialStartDate: moment(),
      trialEndDate: moment().add(7, 'days'),
      hired: false,
      hiredDate: null
    }


  }


}

module.exports = StaffController
