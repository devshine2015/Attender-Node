'use strict'

const Command = use('Command')
const Hash = use('Hash')
const User = use('App/Model/User')


class CreateAdmin extends Command {

  get signature () {
    return 'create-admin'
  }

  get description () {
    return 'Create Super Admin'
  }

  * handle (args, options) {
    this.info(`Creating super admin with email of admin@attender.com.au`)
    let exist = yield User.findOne({ email: 'admin@attender.com.au' })
    if (exist) {
      console.log('admin@attender.com already exist, please remove to continue');
      process.exit(1)
    } else {
      let admin = yield User.create({
        email: 'admin@attender.com.au',
        fullname: 'Administrator',
        promisePay: true,
        password: yield Hash.make('password'),
        isAdmin: true,
        verified: true,
        walletId: 'admin-token'
      })
      console.log('Admin created!')
      process.exit(1)
    }
  }
}

module.exports = CreateAdmin
