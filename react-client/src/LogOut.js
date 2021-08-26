import React from 'react';

export default class LogOut extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch("/v1/api/logout", {
            method: 'POST'
        })
            .then(r => r.json().then(data => ({ status: r.status, body: data })))
            .then(
                (res) => {
                    if (res.status === 200) {
                        console.log("Clearing local storage.");
                        localStorage.clear();
                        this.props.onBackToRoot();
                    } else if (res.status === 403) {
                        alert(res.body.errMsg);
                    } else if (res.status === 400) {
                        alert(res.body.errMsg);
                    } else {
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

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="submit" value="Log out" />
                </form>
            </div>
        );
    }
}