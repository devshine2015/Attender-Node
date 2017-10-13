'use strict'

const User = use('App/Model/User')
const Venue = use('App/Model/Venue')
const Message = use('App/Model/Message')
const Staff = use('App/Model/Staff')

class StaffController {

  * index (req, res) {
    let venue = yield Venue.findOne({ _id: req.user.venueId })
    let staffs = yield Staff.find({ _id: {$nin: venue.myStaffs}  }).populate('user', '_id')
    yield res.sendView('web/staff/index', { staffs: staffs })
  }

  * save (req, res) {

    let staff = yield Staff.create({
      user: req.user._id,
      email: req.user.email,
      mobile: req.user.mobile,
      fullname: req.input('fullname', ''),
      bio: req.input('bio', ''),
      description: req.input('description', []),
      gender: req.input('gender'),
      birthdate: new Date(req.input('birthdate')),
      preferredLocation: req.input('location'),
      preferredDistance: req.input('distance'),
      frequency: req.input('frequency'),
      position: req.input('positions', []),
      startRate: req.input('startRate', 10),
      endRate: req.input('endRate', 15),
      rateBadge: req.input('rateBadge'),
      rateType: req.input('rateType', 'hourly'),
      certificates: req.input('qualifications', []),
      availability: req.input('availability', {}),
      languages: req.input('languages', {}),
    })
    req.user.staffId = staff._id
    req.user.isStaff = true
    req.user.hasProfile = true
    req.user.save()

    res.json({ status: true, data: req.user })
  }

  * messages (req, res) {

    let threads = yield Message.aggregate(
      {
        $match: { $or : [{ sender: req.user._id }, { receiver: req.user._id }] }
      }, {
        $lookup : {
         from: 'venues',
         localField: 'venue',
         foreignField: '_id',
         as: 'venue'
        }
      }, {
        $unwind: '$venue'
      }, {
        $group: {
          _id: '$conversation',
          latest: { $last: '$sentAt' },
          message: { $last: '$message' },
          delivered: { $last: '$delivered' },
          seen: { $last: '$seen' },
          usid: { $last: '$venue.user'},
          uselect: { $last: '$venue._id' },
          uname: { $last: '$venue.name' },
          uavatar: { $last: '$venue.image'}
        }
      }, {
        $sort: { latest: -1 }
      }
    )
    res.json({ status: true, threads: threads })
    yield Message.update({ receiver: req.user._id }, { delivered: true }, { multi: true })

  }

}

module.exports = StaffController
