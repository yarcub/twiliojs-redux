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
  }
}
