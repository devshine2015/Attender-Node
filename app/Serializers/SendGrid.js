'use strict'
const Env = use('Env')
const domain = Env.get('MAILGUN_DOMAIN', '')
const webHost = Env.get('WEB_HOST', '45.76.121.86')
const webProtocol = Env.get('WEB_PROTOCOL', 'https')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(Env.get('SENDGRID_API_KEY', ''));
console.log(Env.get('SENDGRID_API_KEY', ''))
module.exports = {

  sendVerification: (user) => {
    let _url = `${webProtocol}://${webHost}/api/redirect/${user.verification}/${user.emailToken}`;
    let _urlWeb = `http://45.76.121.86/confirm/${user.verification}/${user.emailToken}`;
    // let _url = `attenderapp://verify/${user.verification}/${user.emailToken}`;
    let _html = `<h3>Welcome to Attender ${user.fullname}</h3>
                Click <a href="${_urlWeb}" target="_blank">confirm</a> to verify your email on web <br/><br/>
                Click <a href="${_url}" target="_blank">Open Attender App</a> to verify your email on mobile
                `
    sgMail.send({
      to: user.email,
      fromname: 'Attender',
      from: 'hello@attender.com.au',
      subject: 'Account Confirmation',
      text: 'Attender',
      html: _html
    })
  },

  sendForgotPass: (user) => {
    let _url = `${webProtocol}://${webHost}/reset-password/${user.forgotkey}`
    let _html = `<h3>Attender</h3>
                <p>We received a request for a password reset</p>
                <p>Click <a href=${_url}>reset</a> to continue</p>
                `
    sgMail.send({
      to: user.email,
      fromname: 'Attender',
      from: 'tom@attender.com',
      subject: 'Password Reset',
      text: 'Attender',
      html: _html
    })
  }


}
