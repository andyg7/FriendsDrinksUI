require('cross-fetch/polyfill')

let SessionManager = require('./auth_session')
let auth = require('./../auth')

/**
See https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js
**/

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

	signUp(input) {
		let attributeList = [];

		let dataFirstName = {
			Name: 'custom:firstname',
			Value: input.firstname,
		};
		let attributeFirstName = new amazonCognitoIdentity.CognitoUserAttribute(dataFirstName);
		attributeList.push(attributeFirstName);

		let dataLastName = {
			Name: 'custom:lastname',
			Value: input.lastname,
		};
		let attributeLastName = new amazonCognitoIdentity.CognitoUserAttribute(dataLastName);
		attributeList.push(attributeLastName);

		let userPool = this.userPool;
		return new Promise(function (resolve, reject) {
			userPool.signUp(input.email, input.password, attributeList, null, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve('Success');
				}
			});
		});
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

		return new Promise(function (resolve, reject) {
			cognitoUser.authenticateUser(authenticationDetails, {
				onSuccess: function (result) {
					console.log("result from logging in: ", result);
					let sessionId = sessionManager.storeSession(result);
					let payload = result.getIdToken().decodePayload();
					let user = new auth.User(payload['sub'], payload['email'], payload['custom:firstname'], payload['custom:lastname']);
					let loggedInUser = new auth.LoggedInUser(user, sessionId);
					resolve(loggedInUser);
				},
				onFailure: function (err) {
					reject(err);
				}
			});
		});
	}

	logout(loggedInUser) {
		this.sessionManager.deleteSession(loggedInUser.getSessionId());
		let userData = {
			Username: loggedInUser.getUser().getEmail(),
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
		let payload = tokens.getIdToken().decodePayload();
   	    let user = new auth.User(payload['sub'], payload['email'], payload['custom:firstname'], payload['custom:lastname']);
    	return new auth.LoggedInUser(user, sessionId);
	}

	forgotPassword(email, res) {
		let userData = {
			Username: email,
			Pool: this.userPool,
		};
		let cognitoUser = new amazonCognitoIdentity.CognitoUser(userData);
		return new Promise(function (resolve, reject) {
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
	}

	resetPassword(verificationCode, email, newPassword, res) {
		let userData = {
			Username: email,
			Pool: this.userPool,
		};
		let cognitoUser = new amazonCognitoIdentity.CognitoUser(userData);
		return new Promise(function (resolve, reject) {
            cognitoUser.confirmPassword(verificationCode, newPassword, {
                onSuccess: function () {
                    resolve('Success');
                },
                onFailure: function (err) {
                    reject(err);
                }
            });
		});
	}
}

module.exports = UserManagement