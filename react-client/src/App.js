import './App.css';
import React from 'react';
import LoginControl from './Auth';
import LoggedInApp from './LoggedInApp';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionId: ''
    };
  }

  render() {
    if (!this.state.sessionId) {
      return <LoginControl />;
    } else {
      return <LoggedInApp sessionId={this.state.sessionId} />
    }
  }
}

export default App;
