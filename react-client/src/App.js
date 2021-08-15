import './App.css';
import React from 'react';
import LoginControl from './LoginControl';
import LoggedInApp from './LoggedInApp';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionId: ''
    };
    this.handleLoggedIn = this.handleLoggedIn.bind(this);
  }

  handleLoggedIn(sId) {
    this.setState(function (state, props) {
      return {
        sessionId: sId
      }
    });
  }

  render() {
    if (!this.state.sessionId) {
      return <LoginControl onLoggedIn={this.handleLoggedIn} />;
    } else {
      return <LoggedInApp sessionId={this.state.sessionId} />
    }
  }
}

export default App;
