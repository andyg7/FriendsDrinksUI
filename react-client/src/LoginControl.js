import React from 'react';

export default class LoginControl extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 'LOGIN'
        }
    }

    handleSwitch(event) {
        this.setState(function (state, props) {
            if (state.page === 'LOGIN') {
                return {
                    page: 'SIGNUP'
                }
            } else {
                return {
                    page: 'LOGIN'
                }
            }
        });

    }

    render() {
        if (this.state.page === 'LOGIN') {
            return <Login value='Not registered? Sign up!' onLoggedIn={this.props.onLoggedIn} onSwitch={() => this.handleSwitch()} />
        } else {
            return <Signup value='Already have an account? Log in!' onSwitch={() => this.handleSwitch()} />
        }
    };

}

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        if (name === 'email') {
            this.setState({
                email: event.target.value
            })
        } else {
            this.setState({
                password: event.target.value
            })
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = {
            email: this.state.email,
            password: this.state.password
        }
        const dataJson = JSON.stringify(data);
        fetch("/v1/api/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: dataJson
        })
            .then(r => r.json().then(data => ({ status: r.status, body: data })))
            .then(
                (res) => {
                    if (res.status === 200) {
                        this.props.onLoggedIn(res.body.sId);
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
                    <label>
                        Email:
                        <input name="email" type="text" value={this.state.email} onChange={this.handleChange} />
                    </label>
                    <label>
                        Password:
                        <input name="password" type="text" value={this.state.password} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <button onClick={this.props.onSwitch}>
                    {this.props.value}
                </button>
            </div>
        );
    }

}

class Signup extends React.Component {

    constructor(props) {
        super(props);
        this.state = { value: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        console.log(event);
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit={() => this.handleSubmit}>
                    <label>
                        Email:
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <label>
                        First name:
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <label>
                        Last name:
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <button onClick={this.props.onSwitch}>
                    {this.props.value}
                </button>
            </div>
        );
    }
}