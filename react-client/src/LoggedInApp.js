import './App.css';
import Homepage from './Homepage'
import FriendsDrinksDetailPage from './FriendsDrinksDetailPage'
import React from 'react';

class LoggedInApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'HOMEPAGE',
            friendsDrinksId: null
        };
        this.handleGoToDetailPage = this.handleGoToDetailPage.bind(this);
        this.handleGoToHomepage = this.handleGoToHomepage.bind(this);
    }

    handleGoToDetailPage(fId) {
        this.setState({
            page: 'DETAIL_PAGE',
            friendsDrinksId: fId
        })
    }

    handleGoToHomepage() {
        this.setState({
            page: 'HOMEPAGE',
            friendsDrinksId: null
        })
    }

    render() {
        let data;
        if (this.state.page === 'HOMEPAGE') {
            data = <Homepage onGoToDetailPage={this.handleGoToDetailPage} loggedInUser={this.props.loggedInUser} onSessionExpired={this.props.onSessionExpired} userId={this.props.userId} />;
        } else if (this.state.page === 'DETAIL_PAGE') {
            data = <FriendsDrinksDetailPage onGoToHomepage={this.handleGoToHomepage} loggedInUser={this.props.loggedInUser} onSessionExpired={this.props.onSessionExpired} friendsDrinksId={this.state.friendsDrinksId} />
        } else {
            throw new Error('Unknown page ' + this.state.page)
        }
        let div = <div>
            {this.props.logOut}
            {data}
        </div>
        return div;
    }
}

export default LoggedInApp;
