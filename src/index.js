var actions = require('./actions');

module.exports = {
  middleware: require('./middleware'),
  constants: require('./constants'),
  actions: {
    makeCall: actions.makeCall,
    acceptCall: actions.acceptCall,
    rejectCall: actions.rejectCall,
    ignoreCall: actions.ignoreCall,
    toggleMute: actions.toggleMute,
    sendDigits: actions.sendDigits,
    hangupCall: actions.hangupCall
  }
}
