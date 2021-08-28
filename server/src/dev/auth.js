let auth = require('./../auth')

class UserManagement {
	constructor() {
		this.userId = "1";
		this.firstName = "Andrew";
		this.lastName = "Grant";
		this.email = "hello@hello.com";
		this.sessionId = "1234567890";
	}

	getUserId() {
		return this.userId;
	}

	getLoggedInUser(sessionId) {
		let user = new auth.User(this.userId, this.email, this.firstName, this.lastName);
		return user;
	}

	logIn(email, password) {
		let userId = this.userId;
		let email1 = this.email;
		let firstName = this.firstName;
		let lastName = this.lastName;
		let sessionId = this.sessionId;
		return new Promise(function (resolve, reject) {
			let loggedInUser = new auth.LoggedInUser(new auth.User(userId, email1, firstName, lastName), sessionId);
			resolve(loggedInUser);
		});
	}

	logout(loggedInUser) {
		// nop
	}

	signUp(input) {
		return new Promise(function (resolve, reject) {
			resolve('{}');
		});
	}

	forgotPassword(email, res) {
		return new Promise(function (resolve, reject) {
			resolve('{}');
		});
	}

	resetPassword(verificationCode, email, newPassword, res) {
		return new Promise(function (resolve, reject) {
			resolve('{}');
		});
	}

}

module.exports = UserManagement
