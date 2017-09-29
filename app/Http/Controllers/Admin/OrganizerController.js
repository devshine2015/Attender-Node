'use strict'

const Organizer = use('App/Model/Organizer')

module.exports = {

  * index (req, res) {
    let organizers = yield Organizer.find({}).populate('user')
    yield res.sendView('organizer/index', { organizers: organizers })
  }

}
