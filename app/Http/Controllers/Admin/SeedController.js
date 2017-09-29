'use strict'

const Venue = use('App/Model/Venue')
const Organizer = use('App/Model/Organizer')
const Staff = use('App/Model/Staff')
const Event = use('App/Model/Event')
const User = use('App/Model/User')

const Hash = use('Hash')

module.exports = {

  * create (req, res) {
    let users = [],
        staffs = [],
        organizers = [],
        venues = [],
        events = []

    let admin = yield User.create({
      mobile: '',
      fullname: 'Administrator',
      email: 'admin@attender.com.au',
      password: yield Hash.make('password'),
      isAdmin: true,
      verified: true
    })
    admin.password = 'password'

    let john = yield User.create({
      mobile: '+6390090242',
      fullname: 'John Doe',
      email: 'john@gmail.com',
      password: yield Hash.make('password'),
      verified: true,
      isStaff: true,
      hasProfile: true
    })
    let staff1 = yield Staff.create({
      user: john._id,
      email: john.email,
      mobile: john.mobile,
      fullname: john.fullname,
      bio: 'I have 6 years working as a manager through out the Sydney in various pubs and clubs.',
      description: ['Night Owl', 'Mixologist'],
      gender: 'male',
      birthdate: new Date('1990-01-25'),
      preferredLocation: 'Sydney',
      preferredDistance: '5km',
      frequency: 'Full time',
      position: ['manager'],
      startRate: '$27/hr',
      endRate: '$30/hr',
      rateBadge: '$27/hr - $30/hr',
      rateType: 'hourly',
      qualifications: [],
      skills: [],
      experiences: [],
      certificates: [],
      availability: {
        sunday : {
            evening : false,
            afternoon : true,
            morning : false
        },
        saturday : {
            evening : false,
            afternoon : true,
            morning : true
        },
        friday : {
            evening : true,
            afternoon : false,
            morning : false
        },
        thursday : {
            evening : false,
            afternoon : true,
            morning : false
        },
        wednesday : {
            evening : false,
            afternoon : false,
            morning : true
        },
        tuesday : {
            evening : false,
            afternoon : true,
            morning : false
        },
        monday : {
            evening : false,
            afternoon : false,
            morning : true
        }
      },
      licenses: [],
      languages: [],
      responseRate: 87
    })
    john.staffId = staff1._id
    john.save()
    staffs.push(staff1)
    users.push(john)

    let mark = yield User.create({
      mobile: '+6312312242',
      fullname: 'Mark Zuckerberg',
      email: 'markzucerber@facebook.com',
      password: yield Hash.make('password'),
      verified: true,
      isStaff: true,
      hasProfile: true
    })
    let staff2 = yield Staff.create({
      user: mark._id,
      email: mark.email,
      mobile: mark.mobile,
      fullname: mark.fullname,
      bio: 'I have 9 years working as a bartender through out the Sydney in various pubs and clubs.',
      description: ['Night Owl', 'Mixologist'],
      gender: 'male',
      birthdate: new Date('1990-01-25'),
      preferredLocation: 'Sydney',
      preferredDistance: '15km',
      frequency: 'Full time',
      position: ['bartender'],
      startRate: '$35/hr',
      endRate: '$40/hr',
      rateBadge: '$35/hr - $40/hr',
      rateType: 'hourly',
      qualifications: [],
      skills: [],
      experiences: [],
      certificates: [],
      availability: {
        sunday : {
            evening : true,
            afternoon : true,
            morning : true
        },
        saturday : {
            evening : true,
            afternoon : true,
            morning : true
        },
        friday : {
            evening : true,
            afternoon : true,
            morning : true
        },
        thursday : {
            evening : true,
            afternoon : true,
            morning : true
        },
        wednesday : {
            evening : true,
            afternoon : true,
            morning : true
        },
        tuesday : {
            evening : true,
            afternoon : true,
            morning : true
        },
        monday : {
            evening : true,
            afternoon : true,
            morning : true
        }
      },
      licenses: [],
      languages: [],
      responseRate: 99
    })
    mark.staffId = staff2._id
    mark.save()
    staffs.push(staff2)
    users.push(mark)

    let steve = yield User.create({
      mobile: '+78956765',
      fullname: 'Steve Jobs',
      email: 'stevejobs@apple.com',
      password: yield Hash.make('password'),
      verified: true
    })
    let venue1 = yield Venue.create({
      user: steve._id,
      name: 'iRestaurant',
      managerName: 'Steve Woz',
      type: ['restaurant', 'cafe'],
      location: [151.215297,-33.856784],
      locationName: 'Sydney',
      openingHours: {
        Weekdays : {
          startWeekDays : new Date("2017-09-29T14:30:00+08:00"),
          endWeekDays : new Date("2017-09-29T14:30:00+08:00")
        },
        Weekends : {
          startWeekEnds : new Date("2017-09-29T14:30:00+08:00"),
          endWeekEnds : new Date("2017-09-29T14:30:00+08:00")
        }
      },
      numberEmployees: 25,
      services: ['breakfast', 'lunch', 'dinner', 'alcohol', 'drinks', 'cocktails'],
      socialMedia: {}
    })
    steve.venueId = venue1._id
    steve.save()
    venues.push(venue1)
    users.push(steve)
    let jonathan = yield User.create({
      mobile: '+6323253453',
      fullname: 'Jonathan Baldaraje',
      email: 'jonathan@zendcreative.com',
      password: yield Hash.make('password'),
      verified: true,
      hasProfile: true,
      isVenue: true
    })
    let venue2 = yield Venue.create({
      user: jonathan._id,
      name: 'The Pork Club',
      managerName: 'Robert Jaworski',
      type: ['club', 'bar', 'pub'],
      location: [151.215297,-33.856784],
      locationName: 'Sydney',
      openingHours: {
        Weekdays : {
          startWeekDays : new Date("2017-09-29T14:30:00+08:00"),
          endWeekDays : new Date("2017-09-29T14:30:00+08:00")
        },
        Weekends : {
          startWeekEnds : new Date("2017-09-29T14:30:00+08:00"),
          endWeekEnds : new Date("2017-09-29T14:30:00+08:00")
        }
      },
      numberEmployees: 25,
      services: ['alcohol', 'drinks', 'cocktails'],
      socialMedia: {}
    })
    jonathan.venueId = venue2._id
    jonathan.save()
    venues.push(venue2)
    users.push(jonathan)
    let pete = yield User.create({
      mobile: '+565765',
      fullname: 'Pete Gilmour',
      email: 'pete@dripcreative.com',
      password: yield Hash.make('password'),
      verified: true
    })
    users.push(pete)
    let mike = yield User.create({
      mobile: '+867867856',
      fullname: 'Michael Brucal',
      email: 'michael@zendcreative.com',
      password: yield Hash.make('password'),
      verified: true
    })
    users.push(mike)
    let seth = yield User.create({
      mobile: '+78567567',
      fullname: 'Seth Martinez',
      email: 'seth@zendcreative.com',
      password: yield Hash.make('password'),
      verified: true
    })
    users.push(seth)

    let event1 = yield Event.create({
      name: "Mike's Wedding Anniversary",
      description: "Lorem ipsum dolor sit amet, vim ea rebum etiam exerci, vix in fugit zril liberavisse.",
      date: new Date("2017-09-30T00:00:00.000Z"),
      isOrganizer: false,
      isVenue: true,
      staffInterest: [
          {
              "staff" : "bartender",
              "quantity" : 4
          },
          {
              "staff" : "waiter",
              "quantity" : 10
          }
      ],
      type: [],
      time: {
          start: "07:00 PM",
          end: "12:30 AM"
      },
      venueId: venue1._id,
      activeStaff : {},
    })
    events.push(event1)
    let event2 = yield Event.create({
      name: "ABC's Special Gathering",
      description: "Lorem ipsum dolor sit amet, vim ea rebum etiam exerci, vix in fugit zril liberavisse.",
      date: new Date("2017-11-10T00:00:00.000Z"),
      isOrganizer: false,
      isVenue: true,
      staffInterest: [
          {
              "staff" : "bartender",
              "quantity" : 7
          },
          {
              "staff" : "waiter",
              "quantity" : 20
          }
      ],
      type: [],
      time: {
          start: "05:00 PM",
          end: "12:00 AM"
      },
      venueId: venue1._id,
      activeStaff : {},
    })
    events.push(event2)
    let event3 = yield Event.create({
      name: "Jonathan's Birthday Party",
      description: "Lorem ipsum dolor sit amet, vim ea rebum etiam exerci, vix in fugit zril liberavisse.",
      date: new Date("2017-10-15T00:00:00.000Z"),
      isOrganizer: false,
      isVenue: true,
      staffInterest: [
          {
              "staff" : "bartender",
              "quantity" : 6
          },
          {
              "staff" : "waiter",
              "quantity" : 10
          }
      ],
      type: [],
      time: {
          start: "04:00 PM",
          end: "10:00 AM"
      },
      venueId: venue2._id,
      activeStaff : {},
    })
    events.push(event3)
    let event4 = yield Event.create({
      name: "ZXC's Acquaintance Party",
      description: "Lorem ipsum dolor sit amet, vim ea rebum etiam exerci, vix in fugit zril liberavisse.",
      date: new Date("2017-12-15T00:00:00.000Z"),
      isOrganizer: false,
      isVenue: true,
      staffInterest: [
          {
              "staff" : "bartender",
              "quantity" : 10
          },
          {
              "staff" : "waiter",
              "quantity" : 20
          }
      ],
      type: [],
      time: {
          start: "06:30 PM",
          end: "02:00 AM"
      },
      venueId: venue2._id,
      activeStaff : {},
    })
    events.push(event4)
    let event5 = yield Event.create({
      name: "ASD's Ball",
      description: "Lorem ipsum dolor sit amet, vim ea rebum etiam exerci, vix in fugit zril liberavisse.",
      date: new Date("2017-08-15T00:00:00.000Z"),
      isOrganizer: false,
      isVenue: true,
      staffInterest: [
          {
              "staff" : "bartender",
              "quantity" : 3
          },
          {
              "staff" : "waiter",
              "quantity" : 10
          }
      ],
      type: [],
      time: {
          start: "06:30 PM",
          end: "02:00 AM"
      },
      venueId: venue1._id,
      activeStaff : {},
    })
    events.push(event5)
    let event6 = yield Event.create({
      name: "Pete's Birthday Bash",
      description: "Lorem ipsum dolor sit amet, vim ea rebum etiam exerci, vix in fugit zril liberavisse.",
      date: new Date("2017-09-15T00:00:00.000Z"),
      isOrganizer: false,
      isVenue: true,
      staffInterest: [
          {
              "staff" : "bartender",
              "quantity" : 25
          },
          {
              "staff" : "waiter",
              "quantity" : 100
          }
      ],
      type: [],
      time: {
          start: "05:00 PM",
          end: "02:00 AM"
      },
      venueId: venue1._id,
      activeStaff : {},
    })
    events.push(event6)

    res.send({ status: true, admin: admin, users: users, venues: venue, staffs: staffs, events: events})
  }

}
