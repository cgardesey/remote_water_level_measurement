'use strict'

const MqttListener = use('MqttListener');

class Measurement extends MqttListener {
  /**
  * This is the subscription string the listener is listening to.
  *
  * @returns {string}
  */
  get subscription () {
    console.log(`subscription`);
    return 'test/topic';
  }

  /**
  * Message handler. Do what you want with your MQTT message here.
  *
  * @param {String} message Data of the message
  * @param {String[]} wildcardMatches Wildcard matches in your subscription string
  */
  async handleMessage (message, wildcardMatches) {
    console.log(`handleMessage`);
  }
}

module.exports = Measurement
