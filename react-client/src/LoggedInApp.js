import './App.css';
import Homepage from './Homepage'
import FriendsDrinksDetailPage from './FriendsDrinksDetailPage'
import React from 'react';
import Invitation from './Invitation';

class LoggedInApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'HOMEPAGE',
            friendsDrinksId: null
        };
        this.handleGoToDetailPage = this.handleGoToDetailPage.bind(this);
        this.handleGoToHomepage = this.handleGoToHomepage.bind(this);
        this.handleGoToInvitation = this.handleGoToInvitation.bind(this);
    }

    handleGoToDetailPage(fId) {
        this.setState({
            page: 'DETAIL_PAGE',
            friendsDrinksId: fId
        });
    }

    handleGoToHomepage() {
        this.setState({
            page: 'HOMEPAGE',
            friendsDrinksId: null
        });
    }

    handleGoToInvitation(fId) {
        this.setState({
            page: 'INVITATION',
            friendsDrinksId: fId
        });
    }

    render() {
        let data;
        if (this.state.page === 'HOMEPAGE') {
            data = <Homepage onGoToInvitation={this.handleGoToInvitation} onGoToDetailPage={this.handleGoToDetailPage} loggedInUser={this.props.loggedInUser} onSessionExpired={this.props.onSessionExpired} userId={this.props.userId} />;
        } else if (this.state.page === 'DETAIL_PAGE') {
            data = <FriendsDrinksDetailPage onGoToHomepage={this.handleGoToHomepage} loggedInUser={this.props.loggedInUser} onSessionExpired={this.props.onSessionExpired} friendsDrinksId={this.state.friendsDrinksId} />
        } else if (this.state.page === 'INVITATION') {
            data = <Invitation onGoToHomepage={this.handleGoToHomepage} loggedInUser={this.props.loggedInUser} onSessionExpired={this.props.onSessionExpired} friendsDrinksId={this.state.friendsDrinksId} />
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
