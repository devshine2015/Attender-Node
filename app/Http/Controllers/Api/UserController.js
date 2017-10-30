'use strict'
const User = use('App/Model/User')
const Message = use('App/Model/Message')
const Venue = use('App/Model/Venue')
const Staff = use('App/Model/Staff')
const Organizer = use('App/Model/Organizer')

class UserController {

  // GENERAL

  * messages (req, res) {
    let thread = yield Message.find({ $or : [{ sender: req.user._id }, { receiver: req.user._id }] }).sort('-sentAt').distinct().populate('sender', 'receiver')
    res.json({ thread: thread })
  }

  // ORGANIZER

  * getOrganizerProfile (req, res) {
    if (req.user.isOrganizer) {
      let organizer = yield Organizer.findOne(req.user.organizerId._id)
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

    if (req.user.isOrganizer) {
      let organizer = yield Organizer.findOne(req.user.organizerId._id)
      organizer.name = name || organizer.name
      organizer.isCompany = isCompany
      organizer.companyName = companyName || organizer.companyName
      organizer.location = location || organizer.location
      organizer.locationName = locationName || organizer.locationName
      organizer.about = about || organizer.about
      organizer.eventType = eventType || organizer.eventType
      organizer.image = image || organizer.image
      organizer.save()
      yield res.json({ status: true, messageCode: 'UPDATED', data: organizer })

    } else {
      if (req.user.hasProfile) {
        yield res.json({ status: false, messageCode: 'PROFILE_ALREADY_SET' })
      }
      let organizer = yield Organizer.create({
        user: req.user._id,
        name: name,
        isCompany: isCompany,
        location: location,
        locationName: locationName,
        about: about,
        eventType: eventType,
        image: image
      })
      req.user.organizerId = organizer._id
      req.user.isOrganizer = true
      req.user.hasProfile = true
      req.user.save()
      yield res.json({ status: true, messageCode: 'CREATED', data: organizer })
    }
  }

  // VENUE

  * getVenueProfile (req, res) {
    if (req.user.isVenue) {
      let venue = yield Venue.findOne(req.user.venueId._id)
      yield res.json({ status: true, messageCode: 'SUCCESS', data: venue })
    } else {
      yield res.json({ status: false, messageCode: 'INVALID_PROFILE' })
    }
  }

  * saveVenueProfile (req, res) {
    let name = req.input('name', ''),
        managerName = req.input('managerName', ''),
        type = [],
        location = [],
        openingHours = {},
        numberEmployees = req.input('numberEmployees', 0),
        services = [],
        socialMedia = [],
        locationName = req.input('locationName', '')

    try {
      type = req.input('type', '').split(',')
      location = req.input('location', '').split(',')
      services = req.input('services', '').split(',')
      openingHours = JSON.parse(req.input('openingHours', '{}'))
      socialMedia = req.input('socialMedia', '').split(',')
      // socialMedia = JSON.parse(req.input('socialMedia', '{}'))
    } catch (e) {
      console.log(e);
      yield res.json({ status: false, messageCode: 'INVALID_INPUT'})
    }

    if (req.user.isVenue) {
      let venue = yield Venue.findOne(req.user.venueId._id)
      venue.name = name || venue.name
      venue.managerName = managerName || venue.managerName
      venue.type = type || venue.type
      venue.location = location || venue.location
      venue.locationName = locationName || locationName
      venue.openingHours = openingHours || venue.openingHours
      venue.numberEmployees = numberEmployees || venue.numberEmployees
      venue.services = services || venue.services
      venue.socialMedia = socialMedia || venue.socialMedia
      venue.save()
      yield res.json({ status: true, messageCode: 'UPDATED', data: venue })

    } else {
      if (req.user.hasProfile) {
        yield res.json({ status: false, messageCode: 'PROFILE_ALREADY_SET' })
      }
      let venue = yield Venue.create({
        user: req.user._id,
        name: name,
        managerName: managerName,
        type: type,
        location: location,
        locationName: locationName,
        openingHours: openingHours,
        numberEmployees: numberEmployees,
        services: services,
        socialMedia: socialMedia
      })
      req.user.venueId = venue._id
      req.user.isVenue = true
      req.user.hasProfile = true
      req.user.save()

      yield res.json({ status: true, messageCode: 'CREATED', data: venue })
    }

  }

  // STAFF

  * getStaffProfile (req, res) {
    if (req.user.isStaff) {
      let staff = yield Staff.findOne(req.user.staffId._id)
      yield res.json({ status: true, messageCode: 'SUCCESS', data: staff })
    } else {
      yield res.json({ status: false, messageCode: 'INVALID_PROFILE' })
    }
  }

  * saveStaffProfile (req, res) {
    let description = [],
        position = [],
        qualifications = [],
        skills = [],
        experiences = [],
        certificates = [],
        availability = [],
        licenses = [],
        languages = [],
        birthdate = '',
        avatar = ''

    try {
      description = req.input('description', '').split(',')
      position = req.input('position', '').split(',')
      qualifications = req.input('qualifications', '').split(',')
      skills = req.input('skills', '').split(',')
      experiences = JSON.parse(req.input('experiences', '{}'))
      certificates = req.input('certificates', '').split(',')
      licenses = req.input('licenses', '').split(',')
      languages = req.input('languages', '').split(',')
      availability = JSON.parse(req.input('availability', '{}'))
      birthdate = new Date(req.input('birthdate'))
      avatar = req.input('avatar', '')
    } catch (e) {
      yield res.json({ status: false, messageCode: 'INVALID_INPUT'})
    }
    if (req.user.isStaff) {
      let staff = yield Staff.findOne(req.user.staffId._id)
      staff.avatar = avatar
      staff.email = req.user.email
      staff.mobile = req.user.mobile
      staff.fullname = req.input('fullname', req.user.fullname)
      staff.bio = req.input('bio', '') || staff.bio
      staff.description = description || staff.description
      staff.gender = req.input('gender', staff.gender)
      staff.birthdate = birthdate || staff.birthdate
      staff.preferredLocation = req.input('preferredLocation', staff.preferredLocation)
      staff.preferredDistance = req.input('preferredDistance', staff.preferredDistance)
      staff.frequency = req.input('frequency', staff.frequency)
      staff.position = position || staff.position
      staff.startRate = req.input('startRate', staff.startRate)
      staff.endRate = req.input('endRate', staff.endRate)
      staff.rateBadge = req.input('rateBadge', staff.rateBadge)
      staff.rateType = req.input('rateType', staff.rateType)
      staff.qualifications = qualifications || staff.qualifications
      staff.skills = skills || staff.skills
      staff.experiences = experiences || staff.experiences
      staff.certificates = certificates || staff.certificates
      staff.availability = availability || staff.availability
      staff.licenses = licenses || staff.licenses
      staff.languages = languages || staff.languages
      staff.save()
      req.user.staffId = staff._id
      req.user.isStaff = true
      req.user.hasProfile = true
      req.user.save()
      yield res.json({ status: true, messageCode: 'UPDATED', data: staff })
    } else {
      if (req.user.hasProfile) {
        yield res.json({ status: false, messageCode: 'PROFILE_ALREADY_SET' })
      }
      let staff = yield Staff.create({
        user: req.user._id,
        avatar: avatar,
        email: req.user.email,
        mobile: req.user.mobile,
        fullname: req.input('fullname', req.user.fullname),
        bio: req.input('bio', ''),
        description: description,
        gender: req.input('gender'),
        birthdate: birthdate,
        preferredLocation: req.input('preferredLocation'),
        preferredDistance: req.input('preferredDistance'),
        frequency: req.input('frequency'),
        position: position,
        startRate: req.input('startRate', 10),
        endRate: req.input('endRate', 15),
        rateBadge: req.input('rateBadge'),
        rateType: req.input('rateType', 'hourly'),
        qualifications: qualifications,
        skills: skills,
        experiences: experiences,
        certificates: certificates,
        availability: availability,
        licenses: licenses,
        languages: languages,
      })
      req.user.staffId = staff._id
      req.user.isStaff = true
      req.user.hasProfile = true
      req.user.save()
      yield res.json({ status: true, messageCode: 'CREATED', data: staff })
    }
  }

}

module.exports = UserController
