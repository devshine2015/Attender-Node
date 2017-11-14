'use strict'
const Env = use('Env')
const apn = require('apn')

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

/**
=========================
=== APNS Basic ==========
=========================

let options = {
  token: {
    key: "/AuthKey_QV5FPHCBMD.p8",
    keyId: "QV5FPHCBMD",
    teamId: "WFXCBU48U4"
  },
  production: false
};

let apnProvider = new apn.Provider(options)


**/


let options = {
  token: {
    key: "/AuthKey_QV5FPHCBMD.p8",
    keyId: "QV5FPHCBMD",
    teamId: "WFXCBU48U4"
  },
  production: false
};

let apnProvider = new apn.Provider(options)

module.exports = {

  sendIOS: (payload) => {
    let note = new apn.Notification()
    note.expiry = Math.floor(Date.now() / 1000) + 3600
    note.badge = 3
    note.sound = 'ping.aiff'
    note.alert = payload.initialMessge
    note.payload = { messageFrom: payload.fromNoti }
    note.topic = 'com.attender.attender'
    return apnProvider.send(note, payload.deviceToken)
  }

}
