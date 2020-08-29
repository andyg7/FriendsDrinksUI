global.fetch = require('node-fetch');

var express = require('express');
var app = express();

var AwsUserManagement = require('./aws/auth')

var auth = require('./auth');

var myArgs = process.argv.slice(2);

var awsUserManagement = new AwsUserManagement(myArgs[0], myArgs[1]);

var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

const sessionCookieKey = "friendsdrinks-session-id";

app.use(function(req, res, next) {
    console.log("request:", req.method, req.url, req.body);
    next();
});

app.get('/', function (req, res) {
	console.log(req.cookies);
	const sessiondId = req.cookies[sessionCookieKey];
	console.log("session id received from browser: ", sessiondId);
	if (!sessiondId) {
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
		console.log(err);
		res.status(500);
		res.send("Whoops! Something went wrong :(");
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
		console.log(err);
		if (err.code === 'NotAuthorizedException') {
		    res.status(403);
		    res.send("Wrong password");
		} else {
		    res.status(500);
		    res.send("Whoops! Something went wrong :(");
		}
	});
})

app.get('/logout', function (req, res) {
	res.render('logout');
});

app.post('/logout', function (req, res) {
	console.log(req.cookies);
	const sessiondId = req.cookies[sessionCookieKey];
	console.log("session id received from browser: " + sessiondId);
	if (!sessiondId) {
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
			var loggedInUser = new auth.LoggedInUser(new auth.User(username), sessiondId);
			awsUserManagement.logout(loggedInUser);
			res.cookie(sessionCookieKey, "", {
				path: '/',
				expires: new Date(1)
			});
			res.send("You're logged out!");
		}
	}
});

app.get('/forgotpassword', function (req, res) {
   res.sendFile( __dirname + "/views/" + "forgot_password.html" );
})

app.post('/forgotpassword', function (req, res) {
	var email = req.body.email;
	if (!email) {
		res.statusCode = 400;
		res.send('You need to provide an email');	
	}
	awsUserManagement.forgotPassword(email, res).then(function (data) {
        console.log('redirecting')
		res.redirect('/resetpassword');
	}).catch(function (err) {
		console.log(err);
		res.status(500);
		res.send("Whoops! Something went wrong :(");
	});

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
	awsUserManagement.resetPassword(verificationCode, email, newPassword, res).then(function (data) {
	    console.log('redirecting')
		res.redirect('/login');
	}).catch(function (err) {
		console.log(err);
		res.status(500);
		res.send("Whoops! Something went wrong :(");
	});
})

var server = app.listen(8080, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port)
})
