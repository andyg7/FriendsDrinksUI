import { User, LoggedInUser } from './../auth';

class UserManagement {

	getLoggedInUser(sessionId) {
   	    let user = new User("012345689", "test@test.com", "foo", "bar");
        return user;
	}

	login(email, password) {
	    console.log("logging in")
	    return new Promise(function (resolve, reject) {
           let loggedInUser = new LoggedInUser(new User("012345689", "test@test.com", "foo", "bar"), "0123456789");
	       resolve(loggedInUser);
	    });
	}

}

export default UserManagement
