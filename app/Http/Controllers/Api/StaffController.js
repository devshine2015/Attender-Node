'use strict'
const Staff = use('App/Model/Staff')
const Validator = use('Validator')


class StaffController {

  * getStaff (req) {
    return yield Staff.findOne({ _id: req.param('id') }).populate('user')
  }
  * index (req, res) {
    let staffs = yield Staff.find({}).populate('user', '_id fullname email mobile staffId')
    res.json({ status: true, staffs: staffs, messageCode: 'SUCCESS' })
  }

  * select (req, res) {
    let staff = yield this.getStaff(req)
    res.json({ status: true, staff: staff })
  }

  * hire (req, res) {

    let staff = yield this.getStaff(req)



  }


}

module.exports = StaffController
