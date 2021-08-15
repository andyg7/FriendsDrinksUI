let auth = require('./../auth')

class UserManagement {

	getLoggedInUser(sessionId) {
		let user = new auth.User("012345689", "test@test.com", "foo", "bar");
		return user;
	}

	login(email, password) {
		console.log("logging in")
		return new Promise(function (resolve, reject) {
			let loggedInUser = new auth.LoggedInUser(new auth.User("012345689", "test@test.com", "foo", "bar"), "0123456789");
			resolve(loggedInUser);
		});
	}

	logout(loggedInUser) {
		// nop
	}

	signUp(input) {
		return new Promise(function (resolve, reject) {
			resolve("Success");
		});
	}

}

module.exports = UserManagement
