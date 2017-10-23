'use strict'
const Env = use('Env')
const domain = Env.get('MAILGUN_DOMAIN', '')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(Env.get('SENDGRID_API_KEY', ''));

module.exports = {

  sendVerification: (user, req) => {
    let _host = req.hostname()
    let _html = `<h1>Click the Link To Verify Your Email</h1>
                Click the following link to verify your email <a href="https://${_host}/email/verify/${user.verification}/${user.emailToken}" target="_blank">https://${_host}/email/verify/${user.verification}/${user.emailToken}</a>`
    const msg = {
      to: user.email,
      from: 'tom@attender.com',
      subject: 'Account Confirmation',
      text: 'Attender',
      html: _html
    }
    sgMail.send(msg);
  }


}
