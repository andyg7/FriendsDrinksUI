global.fetch = require('node-fetch');

var session = require('./auth_session');
var User = require('./../auth').User;

var AmazonCognitoIdentity = require('amazon-cognito-identity-js');

var poolData = {
    UserPoolId: 'us-east-1_sFPmZMOoq', // Your user pool id here
    ClientId: '3f1crpdsji4vsav79b3s9qfjld', // Your client id here
};

var sessionManager = new session.Manager();

var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var user = {
	userPool: userPool,
	signup: function (email, password) {
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
					resolve(new User(data.user.username));
				}
			});
		});
		return promise;
	},
	login: function (email, password, res) {
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
		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: function (result) {
				res.send(result);
			},

			onFailure: function (err) {
				res.send(JSON.stringify(err));
			}
		});
	},
	forgotPassword: function (email, res) {
		var userData = {
			Username: email,
			Pool: this.userPool,
		};
		var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
		cognitoUser.forgotPassword({
			onSuccess: function (result) {
				res.send(result);
			},
			onFailure: function (err) {
				res.send(JSON.stringify(err));
			}
		});
	},
	resetPassword: function (verificationCode, email, newPassword, res) {
		var userData = {
			Username: email,
			Pool: this.userPool,
		};
		var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
		cognitoUser.confirmPassword(verificationCode, newPassword, {
			onSuccess: function () {
				res.send('Successfully reset password!');
			},
			onFailure: function (err) {
				res.send(JSON.stringify(err));
			}
		});
	}
}


module.exports = {
	user: user,
	userPool: userPool,
}