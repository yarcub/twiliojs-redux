import Immutable from 'immutable';
import {constants} from 'twiliojs-redux';


function connectivityReducer(state, action){
  switch(action.type){
    case constants.CHANGE_DEVICE_STATUS:
      return action.payload.status === 'ready'
    default:
      return state;
  }
}


export default function(state, action) {
  if(!state) return Immutable.Map({});

  return Immutable.Map({
    online: connectivityReducer(state.online, action)
  });
}
