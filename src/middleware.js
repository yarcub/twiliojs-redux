var actions = require('./actions'),
constants = require('./constants');

const middleware = (twilioDevice, token, opts) => store => {
  token().then( value => {
    twilioDevice.ready( device => {
      store.dispatch(actions.changeDeviceStatus(device));
    });

    twilioDevice.offline( device => {
      store.dispatch(actions.changeDeviceStatus(device));
      token().then( value => {
        twilioDevice.setup(value, opts);
      })
    });

    twilioDevice.error( error => {
      store.dispatch(actions.deviceError(error));
    });

    twilioDevice.incoming( conn => {
      store.dispatch(actions.addActiveCall(
        conn.parameters.From,
        conn.parameters.To,
        'inbound',
        Date.now()
      ));
      conn.accept( conn => {

      });

      conn.mute( (isMuted, conn) => {

      })
    });

    twilioDevice.cancel( conn => {
      store.dispatch(actions.missedCall());
    });

    twilioDevice.connect( conn => {
      store.dispatch(actions.establishedCall(conn));
    });

    twilioDevice.disconnect( conn => {
      store.dispatch(actions.disconnectedCall(conn));
    });

    twilioDevice.setup(value, opts);
  });

  return next => action => {
    const conn = twilioDevice.activeConnection();
    if(action['@@isTwilioRedux']){
      switch(action.type){
        case constants.MAKE_CALL:
          twilioDevice.connect(action.payload);
          next(actions.addActiveCall(
            action.payload.From,
            action.payload.To,
            'outbound',
            Date.now()
          ))
          return;
        case constants.ACCEPT_CALL:
          conn.accept(action.payload);
          return;
        case constants.REJECT_CALL:
          conn.reject();
          return;
        case constants.IGNORE_CALL:
          conn.ignore();
          return;
        case constants.TOGGLE_MUTE:
          conn.mute(!conn.isMuted());
          return;
        case constants.SEND_DIGITS:
          conn.sendDigits(action.payload);
          return;
        case constants.HANGUP_CALL:
          conn.disconnect();
          return;
        default:
          throw new Error('Unknown twilio action');
      }
    }
    return next(action);
  }
}

module.exports = middleware;
