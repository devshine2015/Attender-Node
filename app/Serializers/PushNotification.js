'use strict'
const Env = use('Env')
const apn = require('apn')
let gcm = require('node-gcm')


/**
=============================================
=== SETUP APN (Apple Push Notification) ====
=============================================
*/
let iOSoptions = {
  token: {
    key: "/Users/vimwarrior/Projects/DripCreatives/attender-node/AuthKey_QV5FPHCBMD.p8",
    keyId: Env.get('APN_KEY', 'QV5FPHCBMD'),
    teamId: Env.get('APN_TEAM_ID', 'WFXCBU48U4')
  },
  production: false
}
let apnProvider = new apn.Provider(iOSoptions)


/**
=======================================================
=== SETUP GCM/FCM (Google/Firebase Cloud Messaging) ===
=======================================================
**/

let gcmSender = new gcm.Sender(Env.get('FCM_KEY', 'QV5FPHCBMD'))

module.exports = {

  sendIOS: (payload) => {
    let note = new apn.Notification()
    note.expiry = Math.floor(Date.now() / 1000) + 3600
    note.badge = 1
    note.sound = 'ping.aiff'
    note.alert = payload.initialMessge
    note.payload = payload.body
    note.topic = 'com.attender.attender'
    return apnProvider.send(note, payload.deviceToken)
  },

  clearIOS: (token) => {
    let note = new apn.Notification()
    note.badge = 0
    return apnProvider.send(note, token)
  },

  sendAndroid: (payload) => {
    let message = new gcm.Message({
      collapseKey: 'demo',
      priority: 'high',
      contentAvailable: true,
      delayWhileIdle: true,
      timeToLive: 3,
      dryRun: true,
      data: payload.body,
      notification: {
          title: payload.title,
          icon: 'ic_launcher',
          body: payload.message
      }
    })
    return gcmSender.send(message, { registrationTokens: payload.tokens }, 3)
  }



}
