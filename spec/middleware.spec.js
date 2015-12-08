const middleware = require('./../src/middleware'),
  sinon = require('sinon'),
  mockStoreWithMiddleware = require('./util/mock'),
  actions = require('./../src/actions');

const store = {
  dispatch: () => {},
  getState: () => {}
}

const getToken = () => {return Promise.resolve('token')};

var device;
var originalNow = Date.now;

beforeEach(()=>{
  var activeConnection = {
    accept: sinon.spy(),
    reject: sinon.spy(),
    ignore: sinon.spy(),
    mute: sinon.spy(),
    sendDigits: sinon.spy(),
    disconnect: sinon.spy(),
    isMuted(){return false}
  }
  device ={
    setup: sinon.spy(),
    ready: sinon.spy(),
    offline: sinon.spy(),
    error: sinon.spy(),
    incoming: sinon.spy(),
    cancel: sinon.spy(),
    connect: sinon.spy(),
    disconnect: sinon.spy(),
    activeConnection: ()=>{return activeConnection}
  };

  Date.now = () => {return new Date(1)};
})

afterEach(()=>{
  Date.now = originalNow;
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
        sounds:{
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
          status: 'ready', silent: true
        }
      }
    ]

    device.ready = (handler) => {
      handler({
        status(){ return 'ready'; },
        sounds:{
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
          status: 'offline', silent: true
        }
      }
    ]

    device.offline = (handler) => {
      handler({
        status(){ return 'offline'; },
        sounds:{
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

  it('should dispatch add active call action on incoming connection', (done) => {
    const expectedActions = [
      {
        type: '@@twilioRedux/addActiveCall',
        payload: {
          from: '+351910000000',
          to: '+351960000000',
          status: 'pending',
          direction: 'inbound',
          created_at: Date.now()
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

  it('should call twilio connect on make call action', (done) => {
    const expectedActions = [
      {
        type: '@@twilioRedux/addActiveCall',
        payload: {
          from: '+351910000000',
          to: '+351960000000',
          status: 'pending',
          created_at: Date.now(),
          direction: 'outbound'
        }
      }
    ]
    const store = mockStoreWithMiddleware(
      {},
      expectedActions,
      [middleware(device, getToken, {})],
      done
    )

    store.dispatch(actions.makeCall('+351910000000', '+351960000000'))
    sinon.assert.calledWith(device.connect, {From: '+351910000000', To: '+351960000000'});
  })

  it('should accept active twilio connection on accept call action', (done) => {
    const store = mockStoreWithMiddleware(
      {},
      [],
      [middleware(device, getToken, {})],
      done
    )

    const constraints = {optional:{sourceid: 'xxx'}};

    store.dispatch(actions.acceptCall(constraints))

    setTimeout(()=>{
      sinon.assert.calledWith(device.activeConnection().accept, constraints);
      done();
    },0)
  })

  it('should reject active twilio connection on reject call action', (done) => {
    const store = mockStoreWithMiddleware(
      {},
      [],
      [middleware(device, getToken, {})],
      done
    )

    store.dispatch(actions.rejectCall())

    setTimeout(()=>{
      sinon.assert.called(device.activeConnection().reject);
      done();
    },0)
  })

  it('should ignore active twilio connection on ignore call action', (done) => {
    const store = mockStoreWithMiddleware(
      {},
      [],
      [middleware(device, getToken, {})],
      done
    )

    store.dispatch(actions.ignoreCall());

    setTimeout(()=>{
      sinon.assert.called(device.activeConnection().ignore);
      done();
    },0)
  })

  it('should mute active twilio connection on mute call action', (done) => {
    const store = mockStoreWithMiddleware(
      {},
      [],
      [middleware(device, getToken, {})],
      done
    )

    store.dispatch(actions.toggleMute());

    setTimeout(()=>{
      sinon.assert.calledWith(device.activeConnection().mute, true);
      done();
    },0)
  })

  it('should send digits to active twilio connection on send digits action', (done) => {
    const store = mockStoreWithMiddleware(
      {},
      [],
      [middleware(device, getToken, {})],
      done
    )

    store.dispatch(actions.sendDigits('25#*'));

    setTimeout(()=>{
      sinon.assert.called(device.activeConnection().sendDigits, '25#*');
      done();
    },0)
  })

  it('should disconnect active twilio connection on hangup action', (done) => {
    const store = mockStoreWithMiddleware(
      {},
      [],
      [middleware(device, getToken, {})],
      done
    )

    store.dispatch(actions.hangupCall());

    setTimeout(()=>{
      sinon.assert.calledWith(device.activeConnection().disconnect);
      done();
    },0)
  })

  it('should add outbound active call on make call action', (done) => {
    const expectedActions = [
      {
        type: '@@twilioRedux/addActiveCall',
        payload: {
          from: '+351910000000',
          to: '+351960000000',
          direction: 'outbound',
          status: 'pending',
          created_at: Date.now()
        }
      }
    ]
    const store = mockStoreWithMiddleware(
      {},
      expectedActions,
      [middleware(device, getToken, {})],
      done
    )

    store.dispatch(actions.makeCall('+351910000000', '+351960000000'));
  })

});
