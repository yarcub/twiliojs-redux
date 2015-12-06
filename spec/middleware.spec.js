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

  it('should setup device when token resolved', (done) => {
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

  it('should dispatch device error action on error', (done) => {
    const expectedActions = [
      {
        type: '@@twilioRedux/deviceError',
        payload: {
          code: '1234',
          message: 'an error occurred'
        },
        isError: true
      }
    ]

    device.error = (handler) => {
      handler({code: '1234', message: 'an error occurred'});
    };

    mockStoreWithMiddleware(
      {},
      expectedActions,
      [middleware(device, getToken, {})],
      done
    )
  })

  it('should dispatch incoming call action on incoming connection', (done) => {
    const expectedActions = [
      {
        type: '@@twilioRedux/incomingCall',
        payload: {
          sid: '1234',
          from: '+351910000000',
          to: '+351960000000',
          status: 'pending',
          direction: 'inbound',
          created_at: new Date() //FIXME: use stable values
        }
      }
    ]

    device.incoming = (handler) => {
      handler({
        parameters: {
          CallSid: '1234',
          From: '+351910000000',
          To: '+351960000000'
        },
        status(){return 'pending'}
      });
    };

    mockStoreWithMiddleware(
      {},
      expectedActions,
      [middleware(device, getToken, {})],
      done
    )
  })

  it('should dispatch missed call action on cancel connection', (done) => {
    const expectedActions = [
      {
        type: '@@twilioRedux/missedCall'
      }
    ]

    device.cancel = (handler) => {
      handler({});
    };

    mockStoreWithMiddleware(
      {},
      expectedActions,
      [middleware(device, getToken, {})],
      done
    )
  })

  it('should dispatch establised call action on connected connection', (done) => {
    const expectedActions = [
      {
        type: '@@twilioRedux/callEstablished',
        payload: {
          sid: '1234',
          status: 'open'
        }
      }
    ]

    device.connect = (handler) => {
      handler({
        parameters: {
          CallSid: '1234',
          From: '+351910000000',
          To: '+351960000000'
        },
        status(){return 'open'}
      });
    };

    mockStoreWithMiddleware(
      {},
      expectedActions,
      [middleware(device, getToken, {})],
      done
    )
  })

  it('should dispatch disconnected call action on disconnected connection', (done) => {
    const expectedActions = [
      {
        type: '@@twilioRedux/disconnectedCall',
        payload: {
          status: 'closed'
        }
      }
    ]

    device.disconnect = (handler) => {
      handler({
        parameters: {
          CallSid: '1234',
          From: '+351910000000',
          To: '+351960000000'
        },
        status(){return 'closed'}
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
