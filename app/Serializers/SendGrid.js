'use strict'
const Env = use('Env')
const domain = Env.get('MAILGUN_DOMAIN', '')
const webHost = Env.get('WEB_HOST', 'staging.attender.com.au')
const webProtocol = Env.get('WEB_PROTOCOL', 'https')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(Env.get('SENDGRID_API_KEY', ''));
module.exports = {

  sendVerification: (user) => {
    let _url = `${webProtocol}://${webHost}/api/redirect/${user.verification}/${user.emailToken}`;
    // let _urlWeb = `http://45.76.121.86/confirm/${user.verification}/${user.emailToken}`;
    // let _url = `attenderapp://verify/${user.verification}/${user.emailToken}`; Click <a href="${_urlWeb}" target="_blank">confirm</a> to verify your email on web <br/><br/>
    let _html = `<h3>Welcome to Attender ${user.fullname}</h3>
                Click <a href="${_url}" target="_blank">Open Attender App</a> to verify your email.`
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
  },

  sendWithdrawMoney: (isSend) => {
    let _html = `<h3>Attender</h3>
                <p>You have successfully transfered your money  to your bank.</p>
                `
    if(!isSend) {
        _html = `<h3>Attender</h3>
                <p>There was a problem transferring money to your bank.</p>
                `
    }
    sgMail.send({
      to: user.email,
      fromname: 'Attender',
      from: 'tom@attender.com',
      subject: 'Password Reset',
      text: 'Attender',
      html: _html
    })
  },

  // sendJobOffer: (user) => {
  //   let _html = `<h3>Attender</h3>
  //               <p>You have a new job offer. Please check your account on : </p>
  //               `
   
  //   sgMail.send({
  //     to: user.email,
  //     fromname: 'Attender',
  //     from: 'tom@attender.com',
  //     subject: 'Password Reset',
  //     text: 'Attender',
  //     html: _html
  //   })
  // },

  trial : (staff, employer) => {
    let _html = `<h3>Attender</h3>
                <p>${employer.name} put you to trial for 7 days.</p>
                `
   
    sgMail.send({
      to: employer.email,
      fromname: 'Attender',
      from: 'tom@attender.com',
      subject: 'Password Reset',
      text: 'Attender',
      html: _html
    })
  },

  transfer : (staff, employer, amount, status) => {
    let _html = `<h3>Attender</h3>
                  <p>${employer.name} successfully transfered $${amount} to your account</p>
                `
    sgMail.send({
      to: staff.email,
      fromname: 'Attender',
      from: 'tom@attender.com',
      subject: 'Password Reset',
      text: 'Attender',
      html: _html
    })
  },

  hired : (staff, employer) => {
    let _html = `<h3>Attender</h3>
                  <p>${employer.name} hired you</p>
                `
    sgMail.send({
      to: staff.email,
      fromname: 'Attender',
      from: 'tom@attender.com',
      subject: 'Password Reset',
      text: 'Attender',
      html: _html
    })
  },

  eventInterest : (staff, $event) => {
    let _html = `<h3>Attender</h3>
                  <p>${staff.fullname} is interested to your event ${$event.name}</p>
                `
    sgMail.send({
      to: event.email,
      fromname: 'Attender',
      from: 'tom@attender.com',
      subject: 'Password Reset',
      text: 'Attender',
      html: _html
    })
  },

  venueInterest : (staff, $venue) => {
    let _html = `<h3>Attender</h3>
                  <p>${staff.fullname} is interested to your venue ${$venue.name}</p>
                `
    sgMail.send({
      to: venue.email,
      fromname: 'Attender',
      from: 'tom@attender.com',
      subject: 'Password Reset',
      text: 'Attender',
      html: _html
    })
  },

  payment : (staff, employer, amount, status) => {
    let _html = ''
    if (status == 'paid') {
      _html = `<h3>Attender</h3>
                  <p>Payment transfer success with amount of ${amount} to ${staff.fullname}</p>
              `
    } else {
      _html = `<h3>Attender</h3>
                  <p>Payment failed with amount of ${amount} to ${staff.fullname}</p>
              `
    }
    sgMail.send({
      to: employer.email,
      fromname: 'Attender',
      from: 'tom@attender.com',
      subject: 'Password Reset',
      text: 'Attender',
      html: _html
    })
  }

}
