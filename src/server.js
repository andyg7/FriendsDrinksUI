global.fetch = require('node-fetch');

var express = require('express');
var app = express();
var auth = require('./aws/auth')

var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/html/" + "index.html" );
})

app.get('/signup', function (req, res) {
   res.sendFile( __dirname + "/html/" + "signup.html" );
})

app.post('/signup', function (req, res) {
	var email = req.body.email;
	if (!email) {
		res.statusCode = 400;
		res.send('You need to provide an email');	
	}
	var password = req.body.password;
	if (!password) {
		res.statusCode = 400;
		res.send('You need to provide a password');	
	}
	auth.awsSignup.signup(email, password, res);
})

app.get('/login', function (req, res) {
   res.sendFile( __dirname + "/html/" + "login.html" );
})

app.post('/login', function (req, res) {
	var email = req.body.email;
	if (!email) {
		res.statusCode = 400;
		res.send('You need to provide an email');	
	}
	var password = req.body.password;
	if (!password) {
		res.statusCode = 400;
		res.send('You need to provide a password');	
	}
	auth.awsSignup.login(email, password, res);
})

app.get('/forgotpassword', function (req, res) {
   res.sendFile( __dirname + "/html/" + "forgot_password.html" );
})

app.post('/forgotpassword', function (req, res) {
	var email = req.body.email;
	if (!email) {
		res.statusCode = 400;
		res.send('You need to provide an email');	
	}
	auth.awsSignup.forgotPassword(email, res);
})

app.get('/resetpassword', function (req, res) {
   res.sendFile( __dirname + "/html/" + "reset_password.html" );
})

app.post('/resetpassword', function (req, res) {
	var verificationCode = req.body.verificationCode;
	if (!verificationCode) {
		res.statusCode = 400;
		res.send('You need to provide a verification code');	
	}
	var email = req.body.email;
	if (!email) {
		res.statusCode = 400;
		res.send('You need to provide an email');	
	}
	var newPassword = req.body.newPassword;
	if (!newPassword) {
		res.statusCode = 400;
		res.send('You need to provide a new password');	
	}
	auth.awsSignup.resetPassword(verificationCode, email, newPassword, res);
})

var server = app.listen(8080, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port)
})
