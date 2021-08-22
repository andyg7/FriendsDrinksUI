import React from 'react';

export default class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            homepageDto: null
        };
    }

    componentDidMount() {
        console.log("fetching");
        fetch("/v1/api/userhomepages/" + this.props.loggedInUser.sessionId)
            .then(r => r.json().then(data => ({ status: r.status, body: data })))
            .then(
                (res) => {
                    if (res.status === 200) {
                        console.log(res.body);
                        this.setState({
                            homepageDto: res.body
                        })
                    } else if (res.status === 403) {
                        console.log(res.body.errMsg);
                        alert(res.body.errMsg);
                    } else if (res.status === 400) {
                        console.log(res.body.errMsg);
                        alert(res.body.errMsg);
                    } else {
                        console.log(res.body.errMsg);
                        alert(res.body.errMsg);
                    }
                }
                //,
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                // (error) => {
                // console.log(error);
                // }
            )
            .catch((error) => {
                console.error('Error:', error);
                alert("Failed to retrieve homepage data - please refresh the page and try again!!");
            });
    }



    render() {
        const dto = this.state.homepageDto;
        if (!dto) {
            return (
                <div>
                    {this.props.loggedInUser.sessionId}
                    <h1>Welcome back {this.props.loggedInUser.firstName}!</h1>
                </div>
            );
        }
        const friendsDrinksListItem = dto.friendsDrinksList.map((x) => <li key={x}>{x}</li>);
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
