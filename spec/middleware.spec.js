const middleware = require('./../src/middleware'),
  sinon = require('sinon'),
  mockStoreWithMiddleware = require('./util/mock');

const store = {
  dispatch: () => {},
  getState: () => {}
}

const getToken = () => {return Promise.resolve('token')};

var device;

beforeEach(()=>{
  device ={
    setup: sinon.spy(),
    ready: sinon.spy(),
    offline: sinon.spy(),
    error: sinon.spy(),
    incoming: sinon.spy(),
    cancel: sinon.spy(),
    connect: sinon.spy(),
    disconnect: sinon.spy()
  };
})

describe('Twilio Middleware', () => {

  it('should setup device when token is ready', (done) => {
    middleware(device, getToken, {})(store);

    setTimeout(()=>{
      sinon.assert.calledWith(device.setup, 'token', {});
      done();
    },0)
  })

  it('should add callbacks for device events', (done) =>{
    middleware(device, getToken, {})(store);

    setTimeout(()=>{
      sinon.assert.called(device.ready);
      sinon.assert.called(device.offline);
      sinon.assert.called(device.error);
      sinon.assert.called(device.incoming);
      sinon.assert.called(device.cancel);
      sinon.assert.called(device.connect);
      sinon.assert.called(device.disconnect);
      done();
    },0)
  })

  it('should setup device when device is offline', (done) => {
    middleware(device, getToken, {})(store);

    device.offline = (handler) => {
      handler({
        status(){ return 'offline'; },
        sound:{
          incoming(){ return false; }
        }
      });
    };

    setTimeout(()=>{
      sinon.assert.calledTwice(device.setup, 'token', {});
      done();
    },0)
  });

  it('should dispatch change device status action on ready', (done) => {
    const expectedActions = [
      {
        type: '@@twilioRedux/changeDeviceStatus',
        payload: {
          status: 'ready', silent: false
        }
      }
    ]

    device.ready = (handler) => {
      handler({
        status(){ return 'ready'; },
        sound:{
          incoming(){ return false; }
        }
      });
    };

    mockStoreWithMiddleware(
      {},
      expectedActions,
      [middleware(device, getToken, {})],
      done
    )
  })

  it('should dispatch change device status action on offline', (done) => {
    const expectedActions = [
      {
        type: '@@twilioRedux/changeDeviceStatus',
        payload: {
          status: 'offline', silent: false
        }
      }
    ]

    device.offline = (handler) => {
      handler({
        status(){ return 'offline'; },
        sound:{
          incoming(){ return false; }
        }
      });
    };

    mockStoreWithMiddleware(
      {},
      expectedActions,
      [middleware(device, getToken, {})],
      done
    )
  })

});
