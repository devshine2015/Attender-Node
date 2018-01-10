'use strict'
const Employer = use('App/Model/Employer')
const EmployerNotification = use('App/Model/EmployerNotification')
const Venue = use('App/Model/Venue')
const Staff = use('App/Model/Staff')
const Organizer = use('App/Model/Organizer')
const Event = use('App/Model/Event')
const Validator = use('Validator')
const VenueNotification = use('App/Model/VenueNotification')
const moment = require('moment')
const Notify = use('App/Serializers/Notify')

let notify = new Notify()

class EventController {

  * getEvent (req , res) {
    let _event =  yield Event.findOne({ _id: req.param('id') }).populate('employer')
    if (_event) {
      return _event
    } else {
      return yield res.json({ status: false, messageCode: 'NOT_FOUND' })
    }

  }
  * myEvents (req, res) {
    let filter = req.input('date', new Date())
    let startDate = moment(filter).hours(0).minutes(0).seconds(0).milliseconds(0)
    let endDate = moment(filter).hours(23).minutes(59).seconds(59).milliseconds(999)

    if (startDate.isValid() && endDate.isValid()) {
      let events = yield Event.find({ employer: req.user.employer._id, date: { gte: startDate, lt: endDate } }).populate('staffs').populate('employer', '_id name location locationName services type')
      return res.json({ status: true, events })

    } else {
      return res.json({ status: false, messageCode: 'INVALID_DATE_FORMAT' })

    }

  }



  * calendar (req, res) {
    let events = yield Event.find({}).sort('date')
    return res.json({ status: true, events: events })
  }


  * index (req, res) {
    let events = []
    let types = req.input('types', false)
    let near = req.input('near', false)
    if (near) {
      let lat = req.input('lat', 10),
          long = req.input('long', 10)

      let venues = yield Employer.find().where('location').nearSphere({ center: [long, lat], maxDistance: 5})
    } else {
      if (types) {
        types = types.split(',')
        let organisers = yield Employer.find({ isOrganizer: true, eventType: { $in: types } })
        let organisersCollection = organisers.map((org) => org._id.toString())
        events = yield Event.find({ employer: { $in: organisersCollection }})
      } else {
        events = yield Event.find({}).populate('employer')
      }
    }
    // if (types) {
    //   types = types.split(',')
    //   events = events.filter((event) => {
    //       for (let type of types) {
    //         let i = event.type.indexOf(type)
    //         if (i >= 0) {
    //           return true
    //         }
    //       }
    //   })
    // }
    res.json({ status: true, events, messageCode: 'SUCCESS' })
  }

  * create (req, res) {

    if (req.user.isEmployer) {
      const validation = yield Validator.validateAll(req.all(), Event.rules, Event.messages)
      if (validation.fails()) {
        res.json({ status: false, error: validation.messages(), messageCode: 'FAILED' })
      } else {
        let event = yield Event.create({
          name: req.input('name', ''),
          description: req.input('description', ''),
          image: req.input('image', ''),
          staffInterest: JSON.parse(req.input('interest', '[]')),
          date: new Date(req.input('date')),
          time: {
            start: req.input('startTime', 'none'),
            end: req.input('endTime', 'none')
          },
          employer: req.user.employer._id
        })
        res.json({ status: true, event, messageCode: 'SUCCESS'  })
      }
    } else {
      res.json({ status: false, messageCode: 'INVALID_PROFILE' })
    }
  }

  * select (req, res) {
    let _event = yield this.getEvent(req)
    return res.json({ status: true, event: _event })
  }

  * edit (req, res) {
    let _event = yield this.getEvent(req)
    if (_event) {
      _event.name = req.input('name', _event.name)
      _event.description = req.input('description', _event.description)
      _event.date = new Date(req.input('date')) || _event.date
      _event.time = JSON.parse(req.input('time', '{"start": false, "end": false}')) || _event.time
      _event.save()
      return res.json({ status: true, event: _event, messageCode: 'SUCCESS'  })
    }
  }

  * destroy (req, res) {
    let _event = yield this.getEvent(req)
    if (_event) {
      _event.remove()
      return res.json({ status: true, messageCode: 'DELETED' })
    }
  }

  * interested (req, res) {
    let _event = yield this.getEvent(req, res)
    if (req.user.isVenue) {

      if (req.user.employer._id.toString() === _event.employer._id.toString()) {
        let _staffs = []
        for (let _staff in _event.interested) {
            _staffs.push(_staff)
        }
        let staffs = yield Staff.find({ _id: { $in: _staffs } })

        return res.json({ status: true, messageCode: 'SUCCESS', staffs: staffs })

      } else {
        return res.json({ status: false, messageCode: 'UNAUTHORIZED', ids: [req.user.employer._id, _event.employer._id] })
      }

    } else {
      return res.json({ status: false, messageCode: 'INVALID_PROFILE' })
    }
  }

  * interest (req, res) {
    let _event = yield this.getEvent(req, res)
    if (req.user.isStaff) {
      _event.employer.interested[req.user.staffId._id] = { staffId: req.user.staffId._id, interestedAt: new Date(), include: true }
      _event.employer.markModified('interested')
      _event.employer.save()
      _event.interested[req.user.staffId._id] = { staffId: req.user.staffId._id, interestedAt: new Date() }
      _event.markModified('interested')
      _event.save()
      let notification = yield EmployerNotification.create({
        employer: _event.employer._id,
        staffId: req.user.staffId._id,
        eventId: _event._id,
        type: 'event-interest'
      })
      res.json({ status: true, event: _event })
      yield notify.eventInterest(req.user.staffId, _event)
    } else {
      return res.json({ status: false, messageCode: 'INVALID_PROFILE' })
    }
  }

}

module.exports = EventController
