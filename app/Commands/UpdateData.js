'use strict'

const Command = use('Command')
const Env = use('Env')
const Hash = use('Hash')
const User = use('App/Model/User')
const Message = use('App/Model/Message')


class UpdateData extends Command {

  get signature () {
    return 'update-data'
  }

  get description () {
    return 'Update Data'
  }

  * handle (args, options) {
    let updates = 0
    let version = 2
    let confirm = yield this.confirm(`Are you sure you want to update data to ${version}?`).print()
    if (confirm) {
      let messages = yield Message.find({}).populate('sender').populate('receiver')
      for (let message of messages) {
        console.log('updating', message.conversation);
        if (message.sender) {
          if (message.sender.isEmployer) {
            message.employer = message.sender.employer
            yield message.save()
            updates += 1
          }
        }
        if (message.receiver) {
          if (message.receiver.isEmployer){
           message.employer = message.receiver.employer
           yield message.save()
           updates += 1
          }
        }
      }
      console.log('Total Updates', updates);
      process.exit(1)
    } else {
      console.log('Exit');
      process.exit(1)
    }
  }
}

module.exports = UpdateData
