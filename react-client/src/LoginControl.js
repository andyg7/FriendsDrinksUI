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
            return <Login value='Sign up' onSwitch={() => this.handleSwitch()} />
        } else {
            return <Signup value='Already have an account? Log in' onSwitch={() => this.handleSwitch()} />
        }
    };

}

class Login extends React.Component {

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
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit={() => this.handleSubmit}>
                    <label>
                        Name:
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
        event.preventDefault();
    }

    render() {
        return (
            <div>
                This is the sign up page!
                <button onClick={this.props.onSwitch}>
                    {this.props.value}
                </button>
            </div>
        );
    }
}