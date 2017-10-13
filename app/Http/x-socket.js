'use strict'
const User = use('App/Model/User')
const jwt = require('jsonwebtoken')
const Config = use('Config')

const server = use('http').createServer()
const io = use('socket.io')(server)
io.on('connection', (socket) => {
  socket.auth = false

  socket.on('web-auth', (data) => {
    let find = new Promise((resolve, reject) => {
      let user = User.findOne({ webToken: data.token })
      resolve(user)
    }).then((user) => {
      if (user) {
        socket.auth = true
        socket.user = user
        socket.join(user._id)
        console.log('Web User Connected', socket.id, user._id, user.fullname)
      } else {
        socket.disconnect('UNAUTHORIZED')
        console.log('UNAUTHORIZED CONNECTION', socket._id)
      }
    })
  })

  socket.on('mobile-auth', (data) => {

    let auth = new Promise((resolve, reject) => {
      jwt.verify(data.token, Config.get('app.appKey'), {}, (error, decoded) => {
        if (error) {
          return reject(error)
        }
        resolve(decoded)
      })
    }).then((decoded) => {
        if (decoded) {
          let find = new Promise((resolve, reject) => {
            let user = User.findOne({ _id: decoded.payload }).populate('staffId').populate('venueId').populate('organizerId')
            resolve(user)
          }).then((user) => {
            socket.auth = true
            socket.user = user
            console.log('Mobile User Connected', socket.id, user._id, user.fullname)
          })
        } else {
          console.log('UNAUTHORIZED CONNECTION', socket.id)
        }
    })
  })
  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id)
  })

})
io.listen(3000)
console.log('Websocket listening on port 3000');
