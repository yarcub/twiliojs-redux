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

    });

    twilioDevice.incoming( conn => {

    });

    twilioDevice.cancel( conn => {

    });

    twilioDevice.connect( conn => {

    });

    twilioDevice.disconnect( conn => {

    });

    twilioDevice.setup(value, opts);
  });

  return next => action => {
    return next(action);
  }
}

module.exports = middleware;
