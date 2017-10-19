'use strict'

const Venue = use('App/Model/Venue')
const Event = use('App/Model/Event')

module.exports = class EventController {

  * getEvent (req) {
    return yield Event.findOne({ _id: req.param('id') }).populate('venueId')
  }

  * index (req, res) {
    let events = yield Event.find({}).populate('venueId')
    yield res.sendView('event/index', { events: events })
  }

  * show (req, res) {

  }

  * create (req, res) {

  }

  * store (req, res) {

  }

  * edit (req, res) {
    let _event = yield this.getEvent(req)
    yield res.sendView('event/edit', { event: _event })
  }

  * update (req, res) {

  }

}
