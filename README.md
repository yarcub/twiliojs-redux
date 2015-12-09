# Twiliojs Redux

[Twilio's](https://www.twilio.com/docs/api/client) javascript SDK [middleware](http://rackt.github.io/redux/docs/advanced/Middleware.html) for Redux.

```
npm install twiliojs-redux --save
```

## Motivation
A learning experience with redux and Twilio's javascript SDK. Feel free to improve.    
Versioning follows the version number of Twilio javascript SDK. Currently 1.2.0.

## How to

Middleware expects the following dependencies:    
* **Twilio**: the global Twilio instance
* **token**: it expects a function that returns a Promise of a capability token
* **opts**: Twilio sdk [options](https://www.twilio.com/docs/api/client/device)

#### Apply middleware

```javascript
import {createStore, applyMiddleware} from 'redux';
import {middleware} from 'twiliojs-redux';
import fetch from 'isomorphic-fetch';
import rootReducer from './reducers';

const token = () => {
  return fetch('capability_token')
  .then((response) => response.text())
}

const createStoreWithMiddleware = applyMiddleware(
  middleware(Twilio.Device, token, {debug:true})
)(createStore)

const store = createStoreWithMiddleware(rootReducer);
```

#### Actions disptached by middleware
There also a set of actions dispatched by the middleware when something relevant happens. Action types can be found on the module's `constants` object.

| Action        | Payload  | Description |
|---------------|------------|---------|
|CHANGE_DEVICE_STATUS|`{status:'ready', silent:true}`| Device and incoming sound status|
|DEVICE_ERROR| `payload:{code:31208, message:'User denied access to microphone.'}`| Error occurrence. Codes and messages are the same as sent by Twilio SDK|
|ADD_ACTIVE_CALL|`{from:'+351910000000', to:'+351960000000', status:'pending', direction: 'inbound', created_at: '1970-01-01T00:00:00.001Z'}`| Active call start inbound or outbound|
|ESTABLISHED_CALL| `{sid:'1235', status:'open'}`|The active call is established, we now have a new status and the connection sid|
|DISCONECTED_CALL| `{status:'closed'}`| Closed the active connection |
|MISSED_CALL|`{}`| Missed an active call before it was answered |
|SET_CALL_MUTE| `true` | Call is muted |

#### Actions Creators
Smart component can dispatch actions that are interpreted by middleware. Action creators are available on the module's `actions` object.

| Action Creator|
|---------------|
|`makeCall(from, to)`|
|`acceptCall()`|
|`rejectCall()`|
|`ignoreCall()`|
|`toggleMute()`|
|`hangupCall()`|
|`sendDigits(digits)`|

#### Example
There's an simple [example]('/example/') project setup with redux dev tools.
