'use strict'

const Event = use('App/Model/Event')

module.exports = class EventController {

  * getEvent (req) {
    return yield Event.findOne({ _id: req.param('id') }).populate('eventId')
  }

  * index (req, res) {
    let events = yield Event.find({}).populate('eventId')
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
    yield res.sendView('event/edit.njk', { event: _event })
  }

  * update (req, res) {
    const event = yield this.getEvent(req, res)
    event.name = req.input('name', event.name)
    event.description = req.input('description', event.description)
    event.date = req.input('date', event.date)
    event.staffs = req.input('staffs', event.staffs)
    event.staffOfInterest = req.input('staffOfInterest', event.staffOfInterest)
    event.type = req.input('type', event.type)
    event.time = req.input('time', event.time)
    event.time.start = req.input('timeStart', event.time.start)
    event.time.end = req.input('timeEnd', event.time.end)
    event.activeStaff = req.input('activeStaff', event.activeStaff)
    event.interested = req.input('interested', event.interested)
    event.updatedAt = new Date()
    event.isOrganizer = req.input('isOrganizer', event.isOrganizer)
    event.isVenue = req.input('isVenue', event.isVenue)
    
    event.save()
    yield req.with({ message: `Event ${req.name} updated successfully` }).flash()
    return res.redirect('/manage/events')
  }

  * destroy (req, res) {
    let event = yield this.getEvent(req, res)
    if(event) {
      event.remove()
      res.json({ status: true })
    } else {
      res.json({ status: false })
    }
  }

}
