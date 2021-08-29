import React from 'react';

export default class LoginControl extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 'LOG_IN'
        }
        this.handleSwitchToLogIn = this.handleSwitchToLogIn.bind(this);
        this.handleSwitchToSignUp = this.handleSwitchToSignUp.bind(this);
        this.handleSwitchToResetPassword = this.handleSwitchToResetPassword.bind(this);
        this.handleSwitchToForgotPassword = this.handleSwitchToForgotPassword.bind(this);
    }

    handleSwitchToLogIn() {
        this.setState(function (state, props) {
            return {
                page: 'LOG_IN'
            };
        });
    }

    handleSwitchToForgotPassword() {
        this.setState(function (state, props) {
            return {
                page: 'FORGOT_PASSWORD'
            };
        });
    }

    handleSwitchToResetPassword() {
        this.setState(function (state, props) {
            return {
                page: 'RESET_PASSWORD'
            };
        });
    }

    handleSwitchToSignUp() {
        this.setState(function (state, props) {
            return {
                page: 'SIGN_UP'
            };
        });
    }

    render() {
        switch (this.state.page) {
            case 'LOG_IN':
                return <LogIn forgotPasswordMessage='Forgot your password?' onSwitchToForgotPassword={this.handleSwitchToForgotPassword} signUpMessage='Not registered? Sign up!' onLoggedIn={this.props.onLoggedIn} onSwitchToSignUp={this.handleSwitchToSignUp} />;
            case 'SIGN_UP':
                return <SignUp logInMessage='Already have an account? Log in!' onSwitchToLogIn={this.handleSwitchToLogIn} onSignedUp={this.handleSwitchToLogIn} />;
            case 'FORGOT_PASSWORD':
                return <ForgotPassword onSwitchToResetPassword={this.handleSwitchToResetPassword} />;
            case 'RESET_PASSWORD':
                return <ResetPassword onSwitchToLogIn={this.handleSwitchToLogIn} />;
            default:
                throw new Error("Unknown page " + this.state.page);
        }
    };

}

class LogIn extends React.Component {

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
            });
        } else if (name === 'password') {
            this.setState({
                password: event.target.value
            });
        } else {
            throw new Error('Unknown name ' + name);
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = {
            email: this.state.email,
            password: this.state.password
        };
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
                        this.props.onLoggedIn({
                            sessionId: res.body.sId,
                            firstName: res.body.firstName,
                            lastName: res.body.lastName
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
                <button onClick={this.props.onSwitchToSignUp}>
                    {this.props.signUpMessage}
                </button>
                <button onClick={this.props.onSwitchToForgotPassword}>
                    {this.props.forgotPasswordMessage}
                </button>
            </div>
        );
    }

}

class SignUp extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            email: '',
            password: '',
            firstName: '',
            lastName: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        if (name === 'email') {
            this.setState({
                email: event.target.value
            });
        } else if (name === 'password') {
            this.setState({
                password: event.target.value
            });
        } else if (name === 'firstName') {
            this.setState({
                firstName: event.target.value
            });
        } else {
            this.setState({
                lastName: event.target.value
            });
        }
    }

    handleSubmit(event) {
        console.log(event);
        event.preventDefault();
        const data = {
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName
        };
        const dataJson = JSON.stringify(data);
        fetch("/v1/api/signup", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: dataJson
        })
            .then(r => r.json().then(data => ({ status: r.status, body: data })))
            .then(
                (res) => {
                    if (res.status === 200) {
                        this.props.onSignedUp();
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
                        <input name="email" type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <label>
                        First name:
                        <input name="firstName" type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <label>
                        Last name:
                        <input name="lastName" type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <label>
                        Password:
                        <input name="password" type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <p>Sign up today with FriendsDrinks to schedule drinks with your friends!</p>
                <button onClick={this.props.onSwitchToLogIn}>
                    {this.props.logInMessage}
                </button>
            </div>
        );
    }
}

class ForgotPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            email: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = {
            email: this.state.email
        };
        const dataJson = JSON.stringify(data);
        fetch("/v1/api/forgotpassword", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: dataJson
        })
            .then(r => r.json().then(data => ({ status: r.status, body: data })))
            .then(
                (res) => {
                    if (res.status === 200) {
                        alert('Please check your email to reset your password')
                        this.props.onSwitchToResetPassword(res.body.sId);
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

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Email:
                        <input name="email" type="text" value={this.state.email} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}


class ResetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            verificationCode: '',
            newPassword: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        if (name === 'email') {
            this.setState({
                email: event.target.value
            });
        } else if (name === 'verificationCode') {
            this.setState({
                verificationCode: event.target.value
            });
        } else if (name === 'newPassword') {
            this.setState({
                newPassword: event.target.value
            });
        } else {
            throw new Error('Unknown name ' + name);
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = {
            email: this.state.email,
            verificationCode: this.state.verificationCode,
            newPassword: this.state.newPassword
        };
        const dataJson = JSON.stringify(data);
        fetch("/v1/api/resetpassword", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: dataJson
        })
            .then(r => r.json().then(data => ({ status: r.status, body: data })))
            .then(
                (res) => {
                    if (res.status === 200) {
                        this.props.onSwitchToLogIn();
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

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Email:
                        <input name="email" type="text" value={this.state.email} onChange={this.handleChange} />
                    </label>
                    <label>
                        Verification code:
                        <input name="verificationCode" type="text" value={this.state.verificationCode} onChange={this.handleChange} />
                    </label>
                    <label>
                        New password:
                        <input name="newPassword" type="text" value={this.state.newPassword} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}