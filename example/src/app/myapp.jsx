import { connect } from 'react-redux'
import React from 'react';
import {actions} from 'twiliojs-redux';

class MyApp extends React.Component{

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange(event) {
    this.setState({call_to: event.target.value});
  }

  render() {
    return (
      <div>
        <div>
          <input type="text" value={this.state.call_to} onChange={this.handleChange.bind(this)}/>
          <button onClick={this.props.makeCall(this.state.call_to)}>Call</button>
          <button onClick={this.props.sendDigits(this.state.call_to)}>Send DTMF</button>
          <button onClick={this.props.answer}>Answer</button>
          <button onClick={this.props.reject}>Reject</button>
          <button onClick={this.props.mute}>Mute/Unmute</button>
          <button onClick={this.props.hangup}>Hangup</button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isOnline: state.get('online')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    makeCall: (to) => () => {
      dispatch(actions.makeCall('+351308803679', to));
    },
    answer: () => {
      dispatch(actions.acceptCall());
    },
    reject: () => {
      dispatch(actions.rejectCall());
    },
    mute: () => {
      dispatch(actions.toggleMute());
    },
    hangup: () => {
      dispatch(actions.hangupCall());
    },
    sendDigits: (digits) => () => {
      dispatch(actions.sendDigits(digits));
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyApp)
