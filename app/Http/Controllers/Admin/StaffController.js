'use strict'

const Staff = use('App/Model/Staff')
const User = use('App/Model/User')

module.exports = class StaffController {

  * getStaff (req, res) {
    return yield Staff.findOne({ _id: req.param('id') }).populate('user')
  }

  * index (req, res) {
    let staffs = yield Staff.find({}).populate('user')
    yield res.sendView('staff/index', { staffs: staffs })
  }

  * destroy (req, res) {
    let staff = this.getStaff(req)
    staff.remove()
    return res.json({ status: true })
  }
}
