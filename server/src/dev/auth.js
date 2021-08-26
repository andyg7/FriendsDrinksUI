let auth = require('./../auth')

class UserManagement {

	getLoggedInUser(sessionId) {
		let user = new auth.User("userId123", "test@test.com", "foo", "bar");
		return user;
	}

	logIn(email, password) {
		return new Promise(function (resolve, reject) {
			let loggedInUser = new auth.LoggedInUser(new auth.User("userId123", "test@test.com", "foo", "bar"), "sessionId123");
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
