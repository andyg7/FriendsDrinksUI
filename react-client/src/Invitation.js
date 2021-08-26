import React from 'react';

export default class Invitation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reply: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = {
            reply: this.state.reply
        }
        const dataJson = JSON.stringify(data);
        fetch("/v1/api/friendsdrinks/replyToInvitation/" + this.props.friendsDrinksId, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: dataJson
        })
            .then(r => r.json().then(data => ({ status: r.status, body: data })))
            .then(
                (res) => {
                    if (res.status === 200) {
                        this.setState({
                            reply: ''
                        })
                        // Go back to homepage.
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

    handleChange(event) {
        event.preventDefault();
        this.setState({
            reply: event.target.value
        })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Reply
                        <input name="reply" type="text" value={this.state.reply} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Reply to invitation" />
                </form>
            </div>
        );
    }

}