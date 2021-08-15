import './App.css';
import React from 'react';
import LoginControl from './LoginControl';
import LoggedInApp from './LoggedInApp';
import LogOut from './LogOut';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionId: ''
    };
    this.handleLoggedIn = this.handleLoggedIn.bind(this);
    this.handleSessionExpired = this.handleSessionExpired.bind(this);
    this.handleBackToRoot = this.handleBackToRoot.bind(this);
  }

  handleLoggedIn(sId) {
    this.setState(function (state, props) {
      return {
        sessionId: sId
      }
    });
  }

  handleBackToRoot() {
    this.setState({
      sessionId: ''
    });
  }

  handleSessionExpired() {
    this.setState({
      sessionId: ''
    })
  }

  render() {
    const logOut = <LogOut onBackToRoot={this.handleBackToRoot}/>;
    if (!this.state.sessionId) {
      return <LoginControl onLoggedIn={this.handleLoggedIn} />;
    } else {
      return <LoggedInApp logOut={logOut} onSessionExpired={this.handleSessionExpired} sessionId={this.state.sessionId} />
    }
  }
}

export default App;
