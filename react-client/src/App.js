import './App.css';
import React from 'react';
import LoginControl from './LoginControl';
import LoggedInApp from './LoggedInApp';
import LogOut from './LogOut';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: null
    };
    this.handleLoggedIn = this.handleLoggedIn.bind(this);
    this.handleSessionExpired = this.handleSessionExpired.bind(this);
    this.handleBackToRoot = this.handleBackToRoot.bind(this);
  }

  handleLoggedIn(user) {
    this.setState(function (state, props) {
      return {
        loggedInUser: user
      }
    });
  }

  handleBackToRoot() {
    this.setState({
      loggedInUser: null
    });
  }

  handleSessionExpired() {
    this.setState({
      loggedInUser: null
    })
  }

  render() {
    const logOut = <LogOut onBackToRoot={this.handleBackToRoot} />;
    if (!this.state.loggedInUser) {
      return <LoginControl onLoggedIn={this.handleLoggedIn} />;
    } else {
      return <LoggedInApp loggedInUser={this.state.loggedInUser} logOut={logOut} onSessionExpired={this.handleSessionExpired} />
    }
  }
}

export default App;
