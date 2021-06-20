let auth = require('./../auth')

class UserManagement {

	getLoggedInUser(sessionId) {
   	    return new auth.User("012345689", "test@test.com", "foo", "bar");
	}

}

module.exports = UserManagement
