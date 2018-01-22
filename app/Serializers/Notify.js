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
    let device = yield this.getDevice($event.employer.user)
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
    let device = yield this.getDevice(message.receiver)
    if (device) {
      if (message.sender.isStaff) {
        return yield this.send(device, `${message.staff.fullname}: ${message.message}`, { message })
      } else if (message.sender.isVenue) {
        return yield this.send(device, `${message.employer.name}: ${message.message}`, { message })
      } else {
        return yield this.send(device, 'New Message', { message })
      }
    } else {
      return false
    }
  }

  * hired (staff, employer) {
    let device = yield this.getDevice(staff.user._id)
    if (device) {
      return yield this.send(device, `${employer.name} hired you`, {employer})
    } else {
      return device
    }
  }

  * trial (staff, employer) {
    let device = yield this.getDevice(staff.user._id)
    if (device) {
      return yield this.send(device, `${employer.name} put you to trial for 7 days.`, {employer})
    } else {
      return device
    }
  }

  * transfer (staff, employer, amount, status) {
    let staffDevice = yield this.getDevice(staff.user._id)
    let employerDevice = yield this.getDevice(employer.user._id)
    if (employerDevice) {
      if (status == 'completed') {
        yield this.send(employerDevice, `$${amount} was successfully transfered to ${staff.fullname}`, {staff})
      } else {
        yield this.send(employerDevice, `Failed to transfer ${amount} to ${staff.fullname}`, {staff})
      }
    }
    if (staffDevice) {
      yield this.send(staffDevice, `${employer.name} successfully transfered $${amount} to your account`, {employer})
    }
    return true
  }

  * payment (staff, employer, amount, status) {
    let staffDevice = yield this.getDevice(staff.user)
    let employerDevice = yield this.getDevice(employer.user)
    if (staffDevice) {
      yield this.send(staffDevice, `You successfully received $${amount} from ${employer.name} payment`, {employer})
    }
    if (employerDevice) {
      if (status == 'paid') {
        yield this.send(employerDevice, `Payment success with amount of ${amount} to ${staff.fullname}`, {staff})
      } else {
        yield this.send(employerDevice, `Payment failed with amount of ${amount} to ${staff.fullname}`, {staff})
      }
    }
    return true
  }

}

module.exports = Notify
