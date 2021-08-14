
import React from 'react';

export default class FriendsDrinksDetailPage extends React.Component {

    render() {
        const friendsDrinksId = this.props.friendsDrinksId;
        console.log("Friends drinks ID is " + friendsDrinksId);
        // API call to get data and display here.
        return <h1>FriendsDrinks detail page!</h1>;
    }
}