'use strict'

const Command = use('Command')
const Env = use('Env')
const Hash = use('Hash')
const User = use('App/Model/User')


class UpdateData extends Command {

  get signature () {
    return 'update-data'
  }

  get description () {
    return 'Update Data'
  }

  * handle (args, options) {
    let updates = 0
    let version = 1.0
    let confirm = yield this.confirm(`Are you sure you want to update data to ${version}?`).print()
    if (confirm) {
      let users = yield User.find({ promisePay: true })
      for (let user of users) {
        user.promiseId = `${Env.get('PROMISE_ID_PREFIX', 'beta-v1-acc-')}${user._id}`
        yield user.save()
        console.log('SAVED', user._id);
        updates += 1
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
