
import React from 'react';

export default class FriendsDrinksDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detailPageDto: ''
        };
    }

    componentDidMount() {
        console.log("fetching");
        fetch("/v1/api/friendsdrinksdetailpages/" + this.props.friendsDrinksId, {
            headers: {
                cookie: 'friendsdrinks-session-id=' + this.props.loggedInUser.sessionId
            }
        })
            .then(r => r.json().then(data => ({ status: r.status, body: data })))
            .then(
                (res) => {
                    if (res.status === 200) {
                        console.log(res.body);
                        this.setState({
                            detailPageDto: res.body
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
                alert("Failed to retrieve detail page data - please refresh the page and try again!!");
            });
    }

    render() {
        let dto = this.state.detailPageDto;
        console.log(dto);
        if (!dto) {
            return <div>Loading...</div>
        }
        // API call to get data and display here.
        const memberList =
            dto.memberList.map((x) => <li key={x.userId}> {x.firstName} {x.lastName} </li>);
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
                </div>
            </div>
        );
    }
}