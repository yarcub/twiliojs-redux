const constants = require('./constants');

module.exports = {
  changeDeviceStatus(device) {
    return {
      type: constants.CHANGE_DEVICE_STATUS,
      payload: {
        status: device.status(),
        silent: device.sound.incoming()
      }
    }
  },
  deviceError(err) {
    return {
      type: constants.DEVICE_ERROR,
      payload: {
        code: err.code,
        message: err.message
      },
      isError: true
    }
  },
  incomingCall(conn, timestamp) {
    return {
      type: constants.INCOMING_CALL,
      payload: {
        sid: conn.parameters.CallSid,
        from: conn.parameters.From,
        to: conn.parameters.To,
        status: conn.status(),
        created_at: timestamp,
        direction: 'inbound'
      }
    }
  },
  missedCall(conn) {
    return {
      type: constants.MISSED_CALL
    }
  },
  establishedCall(conn){
    return {
      type: constants.ESTABLISHED_CALL,
      payload: {
        sid: conn.parameters.CallSid,
        status: conn.status()
      }
    }
  },
  disconnectedCall(conn){
    return {
      type: constants.DISCONECTED_CALL,
      payload: {
        status: conn.status()
      }
    }
  }
}
