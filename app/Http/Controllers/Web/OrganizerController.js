'use strict'
const Organizer = use('App/Model/Organizer')

class OrganiserController {

  * index (req, res) {
    let organizers = yield Organizer.find({})
    yield res.sendView('web/organiser/index', { organizers: organizers })
  }

  * save (req, res) {
    let organizer = yield Organizer.create({
      user: req.user._id,
      name: req.input('name'),
      isCompany: req.input('isCompany', true),
      companyName: req.input('company', ''),
      location: [],
      locationName: req.input('location'),
      about: req.input('about', ''),
      eventType: req.input('types', [])
    })
    req.user.organizerId = organizer._id
    req.user.isOrganizer = true
    req.user.hasProfile = true
    req.user.save()

    res.json({ status: true, organizer: organizer })
  }

}


module.exports = OrganiserController
