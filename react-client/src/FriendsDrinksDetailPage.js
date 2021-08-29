
import React from 'react';

export default class FriendsDrinksDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detailPageDto: '',
            userIdToInvite: '',
            scheduleDate: ''
        };
        this.handleSubmitUserInvite = this.handleSubmitUserInvite.bind(this);
        this.handleChangeUserInvite = this.handleChangeUserInvite.bind(this);

        this.handleSubmitScheduleDate = this.handleSubmitScheduleDate.bind(this);
        this.handleChangeScheduleDate = this.handleChangeScheduleDate.bind(this);

        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        fetch("/v1/api/friendsdrinks/delete/" + this.props.friendsDrinksId, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(r => r.json().then(data => ({ status: r.status, body: data })))
            .then(
                (res) => {
                    if (res.status === 200) {
                        alert("Deleted!");
                        this.props.onGoToHomepage();
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

    handleSubmitScheduleDate(event) {
        event.preventDefault();
        const data = {
            date: this.state.scheduleDate
        };
        const dataJson = JSON.stringify(data);
        fetch("/v1/api/friendsdrinks/schedule/" + this.props.friendsDrinksId, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: dataJson
        })
            .then(r => r.json().then(data => ({ status: r.status, body: data })))
            .then(
                (res) => {
                    if (res.status === 200) {
                        this.setState({
                            scheduleDate: ''
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

    handleChangeScheduleDate(event) {
        const name = event.target.name;
        console.log('barrr')
        if (name === 'scheduleDate') {
            this.setState({
                scheduleDate: event.target.value
            });
        } else {
            throw new Error('Unknown name');
        }
    }

    handleSubmitUserInvite(event) {
        event.preventDefault();
        const data = {
            userId: this.state.userIdToInvite
        };
        const dataJson = JSON.stringify(data);
        fetch("/v1/api/friendsdrinks/inviteUser/" + this.props.friendsDrinksId, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: dataJson
        })
            .then(r => r.json().then(data => ({ status: r.status, body: data })))
            .then(
                (res) => {
                    if (res.status === 200) {
                        this.setState({
                            userIdToInvite: ''
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

    handleChangeUserInvite(event) {
        const name = event.target.name;
        if (name === 'userIdToInvite') {
            this.setState({
                userIdToInvite: event.target.value
            });
        } else {
            throw new Error('Unknown name');
        }
    }

    componentDidMount() {
        console.log("fetching");
        fetch("/v1/api/friendsdrinksdetailpages/" + this.props.friendsDrinksId, {
            credentials: "same-origin"
        })
            .then(r => r.json().then(data => ({ status: r.status, body: data })))
            .then(
                (res) => {
                    if (res.status === 200) {
                        console.log(res.body);
                        this.setState({
                            detailPageDto: res.body
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
                alert("Failed to retrieve detail page data - please refresh the page and try again!!");
            });
    }


    render() {
        let dto = this.state.detailPageDto;
        console.log(dto);
        if (!dto) {
            return <div>Loading...</div>;
        }
        // API call to get data and display here.
        const memberList =
            dto.memberList.map((x) => <li key={x.userId}> {x.firstName} {x.lastName} </li>);
        const meetupList =
            dto.meetupList.map((x) => <li key={x.date}> {x.date} </li>);
        return (
            <div>
                <button onClick={this.props.onGoToHomepage}>Back to homepage</button>
                <header>Hi {this.props.loggedInUser.firstName}! </header>
                <div>
                    {dto.name}
                </div>
                <div>
                    Members
                    <ul>{memberList}</ul>
                    Meetups
                    <ul>{meetupList}</ul>
                </div>
                <div>
                    Invite user!
                    <form onSubmit={this.handleSubmitUserInvite}>
                        <label>
                            UserId
                            <input name="userIdToInvite" type="text" value={this.state.userIdToInvite} onChange={this.handleChangeUserInvite} />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
                <div>
                    Schedule a friends drinks!
                    <form onSubmit={this.handleSubmitScheduleDate}>
                        <label>
                            Date
                            <input name="scheduleDate" type="text" value={this.state.scheduleDate} onChange={this.handleChangeScheduleDate} />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
                <div>
                    <button onClick={this.handleDelete}>Delete</button>
                </div>
            </div>
        );
    }
}