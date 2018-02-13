'use strict'
const moment = require('moment')

module.exports = {

  initializeTimesheet: (management) => {
    return new Promise((resolve, reject) => {
      if (management) {
        let weekStart = moment().startOf('isoWeek').format()
        let weekEnd = moment().endOf('isoWeek').format()
        let totalPayableHours = 0
        let rate = management.staff.startRate
        let days = []
        let isoWeeks = [1,2,3,4,5,6,7]
        for (let isoWeek of isoWeeks) {
          let date = moment().isoWeekday(isoWeek).hour(0).minute(0).second(0).millisecond(0)
          let week = date.format('dddd').toString().toLowerCase()
          let day = {
            date: date,
            isoWeekPeriod: isoWeek,
            schedules: []
          }
          if (management.schedules[week]) {
            for (let sched of management.schedules[week]) {
              let start = moment(sched.startTime, ['hh:mm A', 'hh A'])
              let end = moment(sched.endTime, ['hh:mm A', 'hh A'])
              let payableHours = (start.isValid() && end.isValid()) ? moment.duration(end.diff(start)).asHours() : 0
              payableHours = payableHours > 0 ? payableHours + 24 : payableHours
              let _break = (management.schedules[week].length > 1) ? 0 : payableHours >= 6 ? 0.5 : 0
              totalPayableHours += payableHours
              day.schedules.push({
                break: _break,
                payableHours: payableHours,
                startTime: sched.startTime,
                endTime: sched.endTime
              })
            }
          } else {
            day.schedules.push({
              break: 0,
              payableHours: 0,
              startTime: '',
              endTime: ''
            })
          }
          days.push(day)
        }
        resolve({ weekStart, weekEnd, totalPayableHours, days, rate, management: management._id, staff: management.staff._id, employer: management.employer })
      } else {
        reject({ error: 'Management Missing'})
      }
    })
  }

}
