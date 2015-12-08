import {middleware} from 'twiliojs-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import {devTools} from 'redux-devtools';
import {Provider} from 'react-redux'
import Twilio from 'Twilio';
import fetch from 'isomorphic-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import MyApp from './myapp.jsx';

import rootReducer from './reducers';

const getToken = ()=>{
  return fetch('capability_token')
  .then((response) => response.text())
}

const createStoreWithMiddleware = compose(
  applyMiddleware(middleware(Twilio.Device, getToken,{debug:true})),
  devTools()
)(createStore);

const store = createStoreWithMiddleware(rootReducer, {});

class Root extends React.Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <MyApp/>
        </Provider>
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
      </div>
    );
  }
}

ReactDOM.render(<Root/>, document.getElementById('app-container'));

/*
<Provider store={store}>
  {() => <CounterApp />}
</Provider>
*/
