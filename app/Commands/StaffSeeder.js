'use strict'

const Command = use('Command')
const Hash = use('Hash')
const User = use('App/Model/User')
const Staff = use('App/Model/Staff')
const StaffManagement = use('App/Model/StaffManagement')
const moment = require('moment')
module.exports = class StaffSeeder extends Command {

  get signature () {
    return 'seed-staffs'
  }

  get description () {
    return 'Seed Staffs'
  }

  * handle (args, options) {
    let totalUsers = 10
    let positions = ['bartender', 'manager', 'waiter', 'chef', 'kitchen', 'barback', 'host']
    for (let i = 1; i <= totalUsers; i++) {
      let user = yield User.create({
        fullname: `Dummy User+${i}`,
        email: `user+${i}@attender.com`,
        mobile: `41111111${i}`,
        hasProfile: true,
        isStaff: true,
        verified: true,
        confirmed: true
      })
      user.password = yield Hash.make('password')
      let randomPositions = positions.sort(function() { return 0.5 - Math.random() })
      let staff = yield Staff.create({
        user: user._id,
        fullname: user.fullname,
        email: user.email,
        mobile: user.mobile,
        bio: `Test Staff ${i}`,
        position: [randomPositions[0]],
        frequency: 'Full time',
        description: ['Night Owl', 'Mixologist'],
        gender: 'male',
        birthdate: new Date('1990-01-25'),
        preferredLocation: 'Sydney',
        preferredDistance: '5km',
        frequency: 'Full time',
        startRate: `2${i}`,
        endRate: `3${i}`,
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
      user.staffId = staff._id
      user.save()
      let isTrial = (i > 5)
      let management = yield StaffManagement.create({
        staff: staff._id,
        venue: '59edbafecb898d602fd0d634',
        trial: isTrial,
        hired: !isTrial
      })
      if (isTrial) {
        management.trialStartDate = moment().format()
        management.trialEndDate = moment().add(7, 'days').format()
        management.save()
      } else {
        management.hiredDate = moment().format()
        management.save()
      }
      console.log(staff.fullname, isTrial);
    }
    process.exit(1)
  }

}
