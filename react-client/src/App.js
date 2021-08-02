import logo from './logo.svg';
import './App.css';
import Homepage from './Homepage'
import FriendsDrinksDetailPage from './FriendsDrinksDetailPage'
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'HOMEPAGE'
    };
  }

  render() {
    if (this.state.page === 'HOMEPAGE') {
      return <Homepage />;
    } else {
      return <FriendsDrinksDetailPage />
    }
  }
}

// function Homepage
// function FriendsDrinksDetailPage
// function Login/Signup 
// About

export default App;
