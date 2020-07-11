global.fetch = require('node-fetch');

var SessionManager = require('./auth_session');
var auth = require('./../auth')

var AmazonCognitoIdentity = require('amazon-cognito-identity-js');

class UserManagement {
	constructor() {
		var poolData = {
			UserPoolId: 'us-east-1_sFPmZMOoq', // Your user pool id here
			ClientId: '3f1crpdsji4vsav79b3s9qfjld', // Your client id here
		};
        this.userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
		this.sessionManager = new SessionManager();
	}

	signup(email, password) {
		var attributeList = [];

		var dataEmail = {
			Name: 'email',
			Value: email,
		};

		var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

		attributeList.push(attributeEmail);

		userPool = this.userPool;
		const promise = new Promise(function (resolve, reject) {
			userPool.signUp(email, password, attributeList, null, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(new auth.User(data.user.username));
				}
			});
		});
		return promise;
	}

	login(email, password) {
		var authenticationData = {
			Username: email,
			Password: password,
		};
		var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
			authenticationData
		);
		var userData = {
			Username: email,
			Pool: this.userPool,
		};
		var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
		var sessionManager = this.sessionManager;
		const promise = new Promise(function (resolve, reject) {
			cognitoUser.authenticateUser(authenticationDetails, {
				onSuccess: function (result) {
					console.log(result);
					const sessionId = sessionManager.storeSession(result);
					var payload = result.getIdToken().decodePayload();
					var user = new auth.User(payload['email']);
					var loggedInUser = new auth.LoggedInUser(user, sessionId);
					resolve(loggedInUser);
				},
				onFailure: function (err) {
					reject(err);
				}
			});
		});
		return promise;
	}

	logout(loggedInUser) {
		this.sessionManager.deleteSession(loggedInUser.getSessionId());
		var userData = {
			Username: loggedInUser.getUser().getUsername(),
			Pool: this.userPool,
		};
		var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
		cognitoUser.signOut();
	}

	getLoggedInUser(sessionId) {
		const tokens = this.sessionManager.getSession(sessionId);
		if (tokens == null) {
			console.log("No logged in user for " + sessionId);
			return tokens;
		}
		console.log("Returned tokens: " + tokens);
		return tokens.getIdToken().decodePayload()['email'];
	}

	forgotPassword(email, res) {
		var userData = {
			Username: email,
			Pool: this.userPool,
		};
		var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
		const promise = new Promise(function (resolve, reject) {
    		cognitoUser.forgotPassword({
			    onSuccess: function (result) {
			        console.log(result);
                    resolve(result);
			    },
			    onFailure: function (err) {
                    reject(err);
			    }
		    });
		});
		return promise;
	}

	resetPassword(verificationCode, email, newPassword, res) {
		var userData = {
			Username: email,
			Pool: this.userPool,
		};
		var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
		const promise = new Promise(function (resolve, reject) {
            cognitoUser.confirmPassword(verificationCode, newPassword, {
                onSuccess: function () {
                    resolve('Success');
                },
                onFailure: function (err) {
                    reject(err);
                }
            });
		});
		return promise;
	}
}

module.exports = UserManagement