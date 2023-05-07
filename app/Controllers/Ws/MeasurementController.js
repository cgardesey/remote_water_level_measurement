'use strict'

class MeasurementController {
    constructor({socket, request}) {
        this.socket = socket
        this.request = request

	console.log(`connected`)
    }

  async onMessage(message) {
    console.log(message)
    this.socket.broadcastToAll('message', message)
  }
}

module.exports = MeasurementController
