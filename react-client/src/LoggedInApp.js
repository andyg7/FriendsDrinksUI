import './App.css';
import Homepage from './Homepage'
import FriendsDrinksDetailPage from './FriendsDrinksDetailPage'
import React from 'react';

class LoggedInApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'HOMEPAGE'
        };
    }

    render() {
        if (this.state.page === 'HOMEPAGE') {
            return <Homepage userId={this.props.userId} />;
        } else {
            return <FriendsDrinksDetailPage friendsDrinksId={this.props.friendsDrinksId} />
        }
    }
}

export default LoggedInApp;
