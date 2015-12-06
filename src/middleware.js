var actions = require('./actions');

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
      store.dispatch(actions.incomingCall(conn, new Date()));
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
    return next(action);
  }
}

module.exports = middleware;
