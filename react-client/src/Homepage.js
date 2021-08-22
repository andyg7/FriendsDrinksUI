import React from 'react';

export default class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            homepageDto: {
                name: "Andrew",
                friendsDrinksList: [{
                    name: "Whiskey drinks"
                }],
                invitations: []
            }
        };
    }

    render() {
        const dto = this.state.homepageDto;
        const friendsDrinksListItem = dto.friendsDrinksList.map((x) => <li key={x.name}>{x.name}</li>);
        return (
            <div>
                {this.props.loggedInUser.sessionId}
                <h1>Welcome back {this.props.loggedInUser.firstName}!</h1>
                <h2>Your FriendsDrinkses!</h2>
                <ul>{friendsDrinksListItem}</ul>
                <h2>Your invitations!</h2>
            </div>
        );
    }
}
