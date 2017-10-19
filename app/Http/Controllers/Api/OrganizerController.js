'use strict'
const Organizer = use('App/Model/Organizer')
const Validator = use('Validator')


class OrganizerController {

  * index (req, res) {
    let organizers = yield Organizer.find({}).populate('user')
    res.json({ status: true, organizers: organizers, messageCode: 'SUCCESS' })
  }

}

module.exports = OrganizerController
