'use strict'
const Env = use('Env')

/**
====================
===== FIREBASE =====
====================

const firebase = require('firebase')
let app = firebase.initializeApp({
  apiKey: "AIzaSyCdGtkvHhulpGJYSXDhgKSpYGVcXweRXvk",
  authDomain: "attender-184506.firebaseapp.com",
  databaseURL: "https://attender-184506.firebaseio.com",
  projectId: "attender-184506",
  storageBucket: "attender-184506.appspot.com",
  messagingSenderId: "547833755930"
})
**/

/**

=========================
==== AMAZON AWS SNS =====
=========================

const SNS = require('sns-mobile')
const EVENTS = SNS.EVENTS

let SNS_KEY_ID = Env.get('SNS_KEY_ID', ''),
    SNS_ACCESS_KEY = Env.get('SNS_ACCESS_KEY', ''),
    ANDROID_ARN = Env.get('SNS_ANDROID_ARN', '')

let androidApp = new SNS({
  platform: SNS.SUPPORTED_PLATFORMS.ANDROID,
  region: 'eu-west-1',
  apiVersion: '2010-03-31',
  accessKeyId: SNS_KEY_ID,
  secretAccessKey: SNS_ACCESS_KEY,
  platformApplicationArn: ANDROID_ARN,
});

androidApp.addUser('some_fake_deviceid_that_i_made_up', JSON.stringify({
  some: 'extra data'
}), function(err, endpointArn) {
  if(err) {
    throw err;
  }

  // Send a simple String or data to the client
  androidApp.sendMessage(endpointArn, 'Hi There!', function(err, messageId) {
    if(err) {
      throw err;
    }

    console.log('Message sent, ID was: ' + messageId);
  });
})

**/

module.exports = {

  send: (payload) => {

  }

}
