'use strict'

const Staff = use('App/Model/Staff')

module.exports = {

  * index (req, res) {
    let staffs = yield Staff.find({}).populate('user')
    yield res.sendView('staff/index', { staffs: staffs })
  }

}
