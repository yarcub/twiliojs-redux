var actions = require('./actions'),
constants = require('./constants');

const middleware = (twilioDevice, token, opts) => store => {
  const getToken = () => token(store.getState())

  getToken().then( value => {
    twilioDevice.ready( device => {
      store.dispatch(actions.changeDeviceStatus(device));
    });

    twilioDevice.offline( device => {
      store.dispatch(actions.changeDeviceStatus(device));
      getToken().then( value => {
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
        store.dispatch(actions.setCallMute(isMuted));
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
    const device = twilioDevice.object;
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
          device.activeConnection().accept(action.payload);
          return;
        case constants.REJECT_CALL:
          device.activeConnection().reject();
          return;
        case constants.IGNORE_CALL:
          device.activeConnection().ignore();
          return;
        case constants.TOGGLE_MUTE:
          device.activeConnection().mute(!device.activeConnection().isMuted());
          return;
        case constants.SEND_DIGITS:
          device.activeConnection().sendDigits(action.payload);
          return;
        case constants.HANGUP_CALL:
          device.activeConnection().disconnect();
          return;
        default:
          throw new Error('Unknown twilio action');
      }
    }
    return next(action);
  }
}

module.exports = middleware;
