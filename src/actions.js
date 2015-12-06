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
  addActiveCall(from, to, direction, timestamp) { //Refactor to addActiveCall
    return {
      type: constants.ADD_ACTIVE_CALL,
      payload: {
        from: from,
        to: to,
        status: 'pending',
        created_at: timestamp,
        direction: direction
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
  },
  /*PUBLIC ACTIONS*/
  makeCall(from, to){
    return {
      '@@isTwilioRedux': true,
      type: constants.MAKE_CALL,
      payload:{
        From: from,
        To: to
      }
    }
  },
  acceptCall(audioConstraints){
    return {
      '@@isTwilioRedux': true,
      type: constants.ACCEPT_CALL,
      payload: audioConstraints
    }
  },
  rejectCall(){
    return {
      '@@isTwilioRedux': true,
      type: constants.REJECT_CALL
    }
  },
  ignoreCall(){
    return {
      '@@isTwilioRedux': true,
      type: constants.IGNORE_CALL
    }
  },
  toggleMute(){
    return {
      '@@isTwilioRedux': true,
      type: constants.TOGGLE_MUTE
    }
  },
  sendDigits(digits){
    return {
      '@@isTwilioRedux': true,
      type: constants.SEND_DIGITS,
      payload: digits
    }
  },
  hangupCall(){
    return {
      '@@isTwilioRedux': true,
      type: constants.HANGUP_CALL
    }
  }
}
