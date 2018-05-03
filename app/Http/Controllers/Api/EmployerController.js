'use strict'

const Staff = use('App/Model/Staff')
const Message = use('App/Model/Message')
const Employer = use('App/Model/Employer')
const StaffManagement = use('App/Model/StaffManagement')
const EmployerNotification = use('App/Model/EmployerNotification')

const Notify = use('App/Serializers/Notify')


let notify = new Notify()



class EmployerController {

  * index (req, res) {
    const empoloyers = yield Employer.find({})
    return res.json({ empoloyers })
  }

  * organisers (req, res) {
    const organisers = yield Employer.find({ isOrganizer: true })
    return res.json({ organisers })
  }

  * venues (req, res) {
    const venues = yield Employer.find({ isVenue: true })
    return res.json({ venues })
  }

  * getVenue (req, res) {
    let venue = yield Employer.findOne({ _id: req.param('id'), isVenue: true })
    return res.json({ status: true, venue, messageCode: 'SUCCESS' })
  }

  * getOrganiser (req, res) {
    return yield Employer.findOne({ _id: req.param('id'), isOrganizer: true })
  }

  * getEmployer (req, res) {
    return yield Employer.findOne({ _id: req.param('id') })
  }




  * getVenueProfile (req, res) {
    if (req.user.isVenue) {
      let venue = yield Employer.findOne({ _id: req.user.employer._id, isVenue: true })
      yield res.json({ status: true, messageCode: 'SUCCESS', data: venue })
    } else {
      yield res.json({ status: false, messageCode: 'INVALID_PROFILE' })
    }
  }


  * saveVenueProfile (req, res) {
    let name = req.input('name', ''),
        managerName = req.input('managerName', ''),
        type = [],
        image = req.input('image', ''),
        info = req.input('info', ''),
        tag1 = req.input('tag1', ''),
        tag2 = req.input('tag2', ''),
        location = [],
        openingHours = {},
        numberEmployees = req.input('numberEmployees', 0),
        services = [],
        socialMedia = [],
        locationName = req.input('locationName', ''),
        staffOfInterest = {}

    try {
      type = req.input('type', '').split(',')
      // location = req.input('location', '').split(',')
      services = req.input('services', '').split(',')
      openingHours = JSON.parse(req.input('openingHours', '{}'))
      socialMedia = req.input('socialMedia', '').split(',')
      staffOfInterest = JSON.parse(req.input('staffOfInterest', '{}'))
    } catch (e) {
      yield res.json({ status: false, messageCode: 'INVALID_INPUT'})
    }
    if (req.user.isEmployer) {
      let employer = req.user.employer
      employer.name = name || employer.name
      employer.image = image || employer.image
      employer.info = info || employer.info
      employer.tag1 = tag1 || employer.tag1
      employer.tag2 = tag2 || employer.tag2
      employer.managerName = managerName || employer.managerName
      employer.type = type || employer.type
      employer.location = location || employer.location
      employer.locationName = locationName || locationName
      employer.openingHours = openingHours || employer.openingHours
      employer.numberEmployees = numberEmployees || employer.numberEmployees
      employer.services = services || employer.services
      employer.socialMedia = socialMedia || employer.socialMedia
      employer.save()
      employer = yield Employer.update(employer)
      yield res.json({ status: true, messageCode: 'UPDATED', data: employer })

    } else {
      if (req.user.hasProfile) {
        yield res.json({ status: false, messageCode: 'PROFILE_ALREADY_SET' })
      }
      let employer = yield Employer.create({
        user: req.user._id,
        name: name,
        tag1: tag1,
        tag2: tag2,
        info: info,
        image: image,
        managerName: managerName,
        type: type,
        location: location,
        locationName: locationName,
        openingHours: openingHours,
        numberEmployees: numberEmployees,
        services: services,
        socialMedia: socialMedia,
        isVenue: true,
        staffOfInterest: staffOfInterest
      })
      req.user.employer = employer._id
      req.user.isVenue = true
      req.user.isEmployer = true
      req.user.hasProfile = true
      req.user.save()
      yield res.json({ status: true, messageCode: 'CREATED', data: employer })
    }
  }




  * getOrganizerProfile (req, res) {
    if (req.user.isOrganizer) {
      let organizer = yield Employer.findOne({ _id: req.user.employer._id, isOrganizer: true })
      yield res.json({ status: true, messageCode: 'SUCCESS', data: organizer })
    } else {
      yield res.json({ status: false, messageCode: 'INVALID_PROFILE' })
    }
  }

  * saveOrganizerProfile (req, res) {

    let name = req.input('name', ''),
        isCompany = req.input('isCompany', "0") == "1" ? true : false,
        companyName = req.input('companyName', ''),
        location = [],
        locationName = req.input('locationName', ''),
        about = req.input('about', ''),
        eventType = [],
        image = req.input('image', '')

    try {
      location = req.input('location', '').split(',')
      eventType = req.input('eventType', '').split(',')
    } catch (e) {
      console.log(e)
      yield res.json({ status: false, messageCode: 'INVALID_INPUT' })
    }

    if (req.user.isEmployer) {
      let employer = req.user.employer
      employer.name = name || employer.name
      employer.isCompany = isCompany
      employer.companyName = companyName || employer.companyName
      employer.location = location || employer.location
      employer.locationName = locationName || employer.locationName
      employer.about = about || employer.about
      employer.eventType = eventType || employer.eventType
      employer.image = image || employer.image
      employer.save()
      yield res.json({ status: true, messageCode: 'UPDATED', data: employer })

    } else {
      if (req.user.hasProfile) {
        yield res.json({ status: false, messageCode: 'PROFILE_ALREADY_SET' })
      }
      let employer = yield Employer.create({
        user: req.user._id,
        name: name,
        isCompany: isCompany,
        location: location,
        locationName: locationName,
        about: about,
        eventType: eventType,
        image: image,
        isOrganizer: true
      })
      req.user.employer = employer._id
      req.user.isEmployer = true
      req.user.isOrganizer = true
      req.user.hasProfile = true
      req.user.save()
      yield res.json({ status: true, messageCode: 'CREATED', data: employer })
    }


  }

  * getVenues (req, res) {
    let venues = []
    let services = req.input('services', false)
    let types = req.input('types', false)

    if (services && types) {
      services = services.split(',')
      types = types.split(',')
      venues = yield Employer.find({ isVenue: true, type: { $in: types }, services: { $in: services } })
    } else if (services && !types) {
      services = services.split(',')
      venues = yield Employer.find({ isVenue: true, services: { $in: services } })

    } else if (types && !services) {
      types = types.split(',')
      venues = yield Employer.find({ isVenue: true, type: { $in: types } })

    } else {
      venues = yield Employer.find({ isVenue: true })
    }

    return res.json({ status: true, venues, messageCode: 'SUCCESS' })

  }


  * notifications (req, res) {
    if (req.user.isEmployer) {
      let count = yield EmployerNotification.find({ opened: false, employer: req.user.employer._id }).count()
      let notifications = yield EmployerNotification.find({ employer: req.user.employer._id }).populate('eventId').populate('staffId').populate('employer').sort('-createdAt')
      res.json({ status: true, messageCode: 'SUCCESS', notifications: notifications, new: count })
      yield EmployerNotification.update({ opened: false, employer: req.user.employer._id }, { opened: true }, { multi: true })

    } else {
     res.json({ status: false, messageCode: 'INVALID_PROFILE' })
    }

  }

  * removeNotif (req, res) {
    let notif = yield EmployerNotification.findOne({ _id: req.param('id') })
    if (notif) {
      notif.remove()
      res.json({ status: true, messageCode: 'DELETED' })
    } else {
      res.json({ status: false, messageCode: 'NOT_FOUND' })
    }
  }

  * interest (req, res) {
    let employer = yield Employer.findOne({ _id: req.param('id'), isVenue: true })
    if (req.user.isStaff) { console.log(req.user._id);
      if(employer.interested[req.user.staffId._id] == undefined){
          employer.interested[req.user.staffId._id] = { staffId: req.user.staffId._id, interestedAt: new Date(), include: true }
          employer.markModified('interested')
          employer.save()
          let notification = yield EmployerNotification.create({
              employer: employer._id,
              staffId: req.user.staffId._id,
              type: 'venue-interest'
          })
          res.json({ status: true, venue: employer })
          yield notify.venueInterest(req.user.staffId, employer)
      }else{
          delete employer.interested[req.user.staffId._id]
          employer.markModified('interested')
          employer.save()
          res.json({ status: true, venue: employer })
      }
    } else {
      return res.json({ status: false, messageCode: 'INVALID_PROFILE' })
    }
  }

  * interested (req, res) {
    if (req.user.isVenue) {
      let staffs = yield Staff.find({ _id: { $in: req.user.employer.myStaffs } })
      return res.json({ status: true, messageCode: 'SUCCESS', staffs })

    } else {
      return res.json({ status: false, messageCode: 'INVALID_PROFILE' })
    }
  }

  * activeStaffs (req, res) {
    let staffs = yield StaffManagement
                      .find({ employer: req.user.employer._id, trial: false })
                      .populate('staff')
                      .populate('ratings')
                      .populate('tasks', '_id description createdAt', null, { sort: { 'createdAt': -1 } })
                      .populate('suggestions', '_id description createdAt', null, { sort: { 'createdAt': -1 } })

    let positions = ['bartender', 'manager', 'waiter', 'chef', 'kitchen', 'barback', 'host']
    let managements = {}
    for (let position of positions) {
      managements[position] = staffs.filter((management) => {
        return (management.staff.position.includes(position))
      })
    }
    res.json({ status: true, staffs, managements })
  }

  * trialStaffs (req, res) {
    let query = req.input('query', false)
    if (query) {
      let rawStaffs = yield Staff.find({ fullname: {$in: new RegExp(query.toString().trim()) } })
      let trials = rawStaffs.map(staff => staff._id)
      let staffs = yield StaffManagement.find({ staff: { $in: trials }, employer: req.user.employer._id, trial: true })
                                        .populate('staff')
      return res.json({ status: (staffs.length > 0), staffs })

    } else {
      let staffs = yield StaffManagement
                        .find({ employer: req.user.employer._id, trial: true })
                        .populate('staff')
                        .populate('ratings')
                        .populate('tasks', '_id description createdAt', null, { sort: { 'createdAt': -1 } })
                        .populate('suggestions', '_id description createdAt', null, { sort: { 'createdAt': -1 } })
      let positions = ['bartender', 'manager', 'waiter', 'chef', 'kitchen', 'barback', 'host']
      let managements = {}
      for (let position of positions) {
        managements[position] = staffs.filter((management) => {
          return (management.staff.position.includes(position))
        })
      }
      return res.json({ status: true, staffs, managements })
    }
  }

  * myStaffs (req, res) {
    let query = req.input('withTrial', false) ? { employer: req.user.employer._id } : { employer: req.user.employer._id, trial: false }
    let managements = yield StaffManagement.find(query).populate('staff')
    let positions = ['bartender', 'manager', 'waiter', 'chef', 'kitchen', 'barback', 'host']
    let staffs = {}
    for (let position of positions) {
      staffs[position] = managements.filter((management) => {
        return (management.staff.position.includes(position))
      })
    }
    return res.json({ status: true, staffs, total: managements.length })
  }


  * sendStaffMsg (req, res) {
    let message = yield Message.create({
      sender: req.user._id,
      receiver: req.input('receiver'),
      message: req.input('message'),
      staff: req.input('staff', ''),
      employer: req.user.employer._id
    })
    res.json({ status: true })
    let m = yield Message.findOne({ _id: message._id }).populate('staff', 'fullname').populate('employer', 'name').populate('sender', '_id isStaff isVenue')
    yield notify.newMessage(m)
    let update = yield Message.update({ conversation: req.param('convo', '') }, { $pull: { archivedTo: { $in: [req.user._id, req.input('receiver')] } } }, { multi: true })
  }

}

module.exports = EmployerController
