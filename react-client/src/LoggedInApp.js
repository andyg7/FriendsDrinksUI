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
        let data;
        if (this.state.page === 'HOMEPAGE') {
            data = <Homepage sessionId={this.props.sessionId} onSessionExpired={this.props.onSessionExpired} userId={this.props.userId} />;
        } else {
            data = <FriendsDrinksDetailPage sessionId={this.props.sessionId} onSessionExpired={this.props.onSessionExpired} friendsDrinksId={this.props.friendsDrinksId} />
        }
        let div = <div>
            {this.props.logOut}
            {data}
        </div>
        return div;
    }
}

export default LoggedInApp;
