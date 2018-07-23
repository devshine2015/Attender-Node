'use strict'

const sendNotification = function(data) {
    const headers = {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": "Basic MjQzNWFkMTAtMDk2Zi00ODJkLTk4N2QtNTVkNWYwMDc3Yzk4"
        };
    
    const options = {
          host: "onesignal.com",
          port: 443,
          path: "/api/v1/notifications",
          method: "POST",
          headers: headers
        };
    
    const https = require('https');
    const req = https.request(options, function(res) {  
          res.on('data', function(data) {
                  console.log("Response:");
                  console.log(JSON.parse(data));
                });
        });
    
    req.on('error', function(e) {
          console.log("ERROR:");
          console.log(e);
        });
    
    req.write(JSON.stringify(data));
    req.end();
};



module.exports = {

  sendPushNotification: (name, ids, isVenue) => {
    let heading = `You have received a new message from ${name}`
    if (isVenue) {
      heading = `${name} has sent you a message`
    }
    const message = { 
        app_id: "e9f7cb2d-430c-4105-8762-daf7b029f60b",
        contents: {"en": "Tap this notification to view."},
        headings: {"en": heading},
        include_player_ids: ids,
        large_icon: "https://api.attender.com.au/attender_icon.png"
    };

    return sendNotification(message);
  }

};
