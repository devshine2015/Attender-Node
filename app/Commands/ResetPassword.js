'use strict'

const Command = use('Command')
const Hash = use('Hash')

class ResetPassword extends Command {

  get signature () {
    return 'reset'
  }

  get description () {
    return 'Pass Reset'
  }

  * handle (args, options) {
    let password = yield Hash.make('password')
    console.log('password', password);
    process.exit(1)
  }

}

module.exports = ResetPassword
