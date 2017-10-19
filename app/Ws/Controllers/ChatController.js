'use strict'

class ChatController {

  constructor (socket, request) {
    this.socket = socket
    this.request = request
    console.log('joined', socket.id);
  }

  * onMessage (message) {

  }

  * joinRoom (room) {
    console.log('room', room);
  }

  * disconnected (socket) {
    console.log('disconnected', socket.id);
  }
}

module.exports = ChatController
