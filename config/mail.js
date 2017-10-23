'use strict'

const Env = use('Env')

module.exports = {
  driver: Env.get('MAIL_DRIVER', 'smtp'),
  connection: Env.get('MAIL_DRIVER', 'smtp'),
  smtp: {
    driver: 'smtp',
    pool: true,
    port: Env.get('MAIL_PORT', 465),
    host: Env.get('MAIL_HOST'),
    secure: false,
    auth: {
      user: Env.get('MAIL_USERNAME'),
      pass: Env.get('MAIL_PASSWORD')
    },
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 10
  }

}
