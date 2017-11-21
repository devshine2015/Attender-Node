'use strict'
const PushNotification = use('PushNotification')
const Device = use('App/Model/Device')

class Notify {

  * getDevice (user) {
    return yield Device.find({ user: user })
  }

  * send (device, message, payload) {
    for (let d of device) {
      if (d.type == 'ios') {
        yield PushNotification.sendIOS({
          deviceToken: d.token,
          initialMessge: message,
          body: payload
        })
      }
    }
    return true
  }

  * eventInterest (staff, $event) {
    let device = yield this.getDevice($event.venueId.user)
    if (device) {
      let message = `${staff.fullname} is interested to your event ${$event.name}`
      yield this.send(device, message, { staff })
    } else {
      return false
    }
  }

  * venueInterest (staff, $venue) {
    let device = yield this.getDevice($venue.user)
    if (device) {
      let message = `${staff.fullname} is interested to your venue ${$venue.name}`
      yield this.send(device, message, { staff })
    } else {
      return false
    }
  }

  * newMessage (message) {
    let device = yield this.getDevice({ user: message.receiver })
    if (device) {
      let initialMessage = 'New Message'
      if (message.sender.isStaff) {
        initialMessage = `${message.staff.fullname}: ${message.message}`
      } else if (message.sender.isVenue) {
        initialMessage = `${message.venue.name}: ${message.message}`
      }
      return yield this.send(device, initialMessage, { message })
    } else {
      return false
    }
  }

}

module.exports = Notify
