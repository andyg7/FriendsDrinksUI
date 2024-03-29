import React from 'react';

export default class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            homepageDto: null,
            createName: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleGoToDetailPage = this.handleGoToDetailPage.bind(this);
        this.handleGoToInvitation = this.handleGoToInvitation.bind(this);
    }

    componentDidMount() {
        console.log("fetching");
        fetch("/v1/api/userhomepages/")
            .then(r => r.json().then(data => ({ status: r.status, body: data })))
            .then(
                (res) => {
                    if (res.status === 200) {
                        console.log(res.body);
                        this.setState({
                            homepageDto: res.body
                        });
                    } else if (res.status === 403) {
                        console.log(res.body.errMsg);
                        alert(res.body.errMsg);
                        this.props.onSessionExpired();
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

    handleSubmit(event) {
        event.preventDefault();
        const data = {
            name: this.state.createName
        };
        const dataJson = JSON.stringify(data);
        fetch("/v1/api/friendsdrinks/create", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: dataJson
        })
            .then(r => r.json().then(data => ({ status: r.status, body: data })))
            .then(
                (res) => {
                    if (res.status === 200) {
                        this.setState({
                            createName: ''
                        });
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
                alert("Unexpected error occured - please try again!!");
            });
    }

    handleChange(event) {
        const name = event.target.name;
        if (name === 'name') {
            this.setState({
                createName: event.target.value
            });
        } else {
            throw new Error('Unknown name');
        }
    }

    handleGoToDetailPage(friendsDrinksId, event) {
        console.log(event);
        console.log(friendsDrinksId);
        event.preventDefault();
        this.props.onGoToDetailPage(friendsDrinksId);
    }

    handleGoToInvitation(friendsDrinksId, event) {
        console.log(event);
        console.log(friendsDrinksId);
        event.preventDefault();
        this.props.onGoToInvitation(friendsDrinksId);
    }

    render() {
        const dto = this.state.homepageDto;
        console.log(dto);
        console.log(this.props.loggedInUser.sessionId);
        if (!dto) {
            return (
                <div>
                    <h1>Loading...</h1>
                </div>
            );
        }
        const adminFriendsDrinksStateList =
            dto.adminFriendsDrinksStateList.map((x) => <li key={x.friendsDrinksId}>
                <button onClick={(e) => this.handleGoToDetailPage(x.friendsDrinksId, e)}>
                    {x.name}
                </button>
            </li>);
        const memberFriendsDrinksStateList =
            dto.memberFriendsDrinksStateList.map((x) => <li key={x.friendsDrinksId}>
                <button onClick={(e) => this.handleGoToDetailPage(x.friendsDrinksId, e)}>
                    {x.name}
                </button>
            </li>);
        const invitations = dto.invitationList.map((x) => <li key={x.friendsDrinksId}>
            <button onClick={(e) => this.handleGoToInvitation(x.friendsDrinksId, e)}>
                {x.message}
            </button>
        </li>);
        return (
            <div>
                <header>Hi {this.props.loggedInUser.firstName}! </header>
                <div>
                    Your FriendsDrinkses!
                    <ul>{adminFriendsDrinksStateList}</ul>
                </div>
                <div>
                    FriendsDrinkses you're a member of!
                    <ul>{memberFriendsDrinksStateList}</ul>
                </div>
                <div>
                    Your invitations!</div>
                <ul>{invitations}</ul>
                <div>
                    Create a new FriendsDrinks!!
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Name
                            <input name="name" type="text" value={this.state.createName} onChange={this.handleChange} />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        );
    }
}
