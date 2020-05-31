global.fetch = require('node-fetch');

var express = require('express');
var app = express();
var AwsUserManagement = require('./aws/auth')

var awsUserManagement = new AwsUserManagement();

var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const sessionCookieKey = "friendsdrinks-session-id";

app.get('/', function (req, res) {
	console.log(req.cookies);
	const sessiondId = req.cookies[sessionCookieKey];
	console.log("session id received from browser: " + sessiondId);
	if (!sessiondId) {
		res.cookie(sessionCookieKey, "", {
			path: '/',
			expires: new Date(1)
		});
		res.redirect('/login');
	} else {
		const username = awsUserManagement.getLoggedInUser(sessiondId);
		if (username == null) {
			res.cookie(sessionCookieKey, "", {
				path: '/',
				expires: new Date(1)
			});
			res.redirect('/login')
		} else {
			res.render('index', { username: username });
		}
	}
})

app.get('/signup', function (req, res) {
   res.sendFile( __dirname + "/views/" + "signup.html" );
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
	awsUserManagement.signup(email, password).then(function (user) {
		res.render('signup_complete', {username: user.username});
	}).catch(function (err) {
		res.send(console.error(err));
	});

})

app.get('/login', function (req, res) {
   res.sendFile( __dirname + "/views/" + "login.html" );
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
	awsUserManagement.login(email, password).then(function (data) {
		var sessionId = data.sessionId;
		console.log("Setting session id in cookie to " + sessionId);
		res.cookie(sessionCookieKey, sessionId, {
			path: '/'
		});
		res.redirect('/');
	}).catch(function (err) {
		res.send(console.error(err));
	});
})

app.get('/forgotpassword', function (req, res) {
   res.sendFile( __dirname + "/views/" + "forgot_password.html" );
})

app.post('/forgotpassword', function (req, res) {
	var email = req.body.email;
	if (!email) {
		res.statusCode = 400;
		res.send('You need to provide an email');	
	}
	awsUserManagement.forgotPassword(email, res);
})

app.get('/resetpassword', function (req, res) {
   res.sendFile( __dirname + "/views/" + "reset_password.html" );
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
	awsUserManagement.resetPassword(verificationCode, email, newPassword, res);
})

var server = app.listen(8080, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port)
})
