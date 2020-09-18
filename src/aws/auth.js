global.fetch = require('node-fetch');

let SessionManager = require('./auth_session');
let auth = require('./../auth')

let amazonCognitoIdentity = require('amazon-cognito-identity-js');

class UserManagement {
	constructor(poolId, clientId) {
		let poolData = {
			UserPoolId: poolId,
			ClientId: clientId
		};
        this.userPool = new amazonCognitoIdentity.CognitoUserPool(poolData);
		this.sessionManager = new SessionManager();
	}

	signup(email, password) {
		let attributeList = [];

		let dataEmail = {
			Name: 'email',
			Value: email,
		};

		let attributeEmail = new amazonCognitoIdentity.CognitoUserAttribute(dataEmail);

		attributeList.push(attributeEmail);

		userPool = this.userPool;
		let promise = new Promise(function (resolve, reject) {
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
		let authenticationData = {
			Username: email,
			Password: password,
		};
		let authenticationDetails = new amazonCognitoIdentity.AuthenticationDetails(
			authenticationData
		);
		let userData = {
			Username: email,
			Pool: this.userPool,
		};
		let cognitoUser = new amazonCognitoIdentity.CognitoUser(userData);
		let sessionManager = this.sessionManager;

		let promise = new Promise(function (resolve, reject) {
			cognitoUser.authenticateUser(authenticationDetails, {
				onSuccess: function (result) {
					console.log("result from logging in: ", result);
					let sessionId = sessionManager.storeSession(result);
					let payload = result.getIdToken().decodePayload();
					let user = new auth.User(payload['email']);
					let loggedInUser = new auth.LoggedInUser(user, sessionId);
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
		let userData = {
			Username: loggedInUser.getUser().getUsername(),
			Pool: this.userPool,
		};
		let cognitoUser = new amazonCognitoIdentity.CognitoUser(userData);
		cognitoUser.signOut();
	}

	getLoggedInUser(sessionId) {
		let tokens = this.sessionManager.getSession(sessionId);
		if (tokens === null) {
			console.log("No logged in user for " + sessionId);
			return null
		}
		console.log("Returned email: " + tokens.getIdToken().decodePayload()['email']);
		return tokens.getIdToken().decodePayload()['email'];
	}

	forgotPassword(email, res) {
		let userData = {
			Username: email,
			Pool: this.userPool,
		};
		let cognitoUser = new amazonCognitoIdentity.CognitoUser(userData);
		let promise = new Promise(function (resolve, reject) {
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
		let userData = {
			Username: email,
			Pool: this.userPool,
		};
		let cognitoUser = new amazonCognitoIdentity.CognitoUser(userData);
		let promise = new Promise(function (resolve, reject) {
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