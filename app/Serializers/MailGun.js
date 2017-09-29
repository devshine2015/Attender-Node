'use strict'
const Env = use('Env')
const apiKey = Env.get('MAILGUN_SECRET', '')
const domain = Env.get('MAILGUN_DOMAIN', '')
const mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain})
let mailcomposer = require('mailcomposer')

module.exports = {

  sendVerification: (user, req) => {
    let _host = req.hostname()
    let _html = `<h1>Click the Link To Verify Your Email</h1>
                Click the following link to verify your email <a href="https://${_host}/email/verify/${user.verification}/${user.emailToken}" target="_blank">https://${_host}/email/verify/${user.verification}/${user.emailToken}</a>`
    console.log(_html);
    let mail = mailcomposer({
      from: 'you@samples.mailgun.org',
      to: user.email,
      subject: 'Test email subject',
      text: 'Test email text',
      html: _html
    })
    mail.build((mailBuildError, message) => {
        let dataToSend = {
            to: user.email,
            message: message.toString('ascii')
        }
        console.log(dataToSend);
        mailgun.messages().sendMime(dataToSend, (sendError, body) => {
            if (sendError) {
                console.log(sendError)
                return
            }
        })
    })
  }


}
