global.fetch = require('node-fetch');

let http = require('http');
let express = require('express');
let auth = require('./auth');
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')

function createServer(userManagement, backendConfig) {
        let app = express();
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(cookieParser())
        app.set('views', __dirname + '/views');
        app.set('view engine', 'ejs');

        app.use(express.static(__dirname + '/public'));

       let sessionCookieKey = "friendsdrinks-session-id";

        app.use(function(req, res, next) {
            console.log("request:", req.method, req.url, req.body);
            next();
        });

        let backendHostname = backendConfig.hostname
        let backendPort = backendConfig.port
        app.get('/', function (req, res) {
            console.log(req.cookies);
            const sessionId = req.cookies[sessionCookieKey];
            console.log("session id received from browser: ", sessionId);
            if (!sessionId) {
                res.redirect('/login');
            } else {
                const username = userManagement.getLoggedInUser(sessionId);
                if (username == null) {
                    res.cookie(sessionCookieKey, "", {
                        path: '/',
                        expires: new Date(1)
                    });
                    res.redirect('/login')
                } else {
                    let path = "/v1/friendsdrinks/" + username
                    var options = {
                      host: backendHostname,
                      port: backendPort,
                      path: path
                    };

                    var req = http.get(options, function(backendRes) {
                      console.log('STATUS: ' + backendRes.statusCode);
                      console.log('HEADERS: ' + JSON.stringify(backendRes.headers));
                      if (statusCode != 200) {
                         backendRes.resume();
                         throw new Error("");
                      }

                      var bodyChunks = [];
                      backendRes.on('data', function(chunk) {
                        bodyChunks.push(chunk);
                      }).on('end', function() {
                        var body = Buffer.concat(bodyChunks);
                        console.log('BODY: ' + body);
                        res.render('index', {
                        username: username,
                        friendsDrinks: [{name: "name", schedule: "schedule", friends: "friends", body: body}]
                        });
                      })
                    });

                    req.on('error', function(e) {
                      console.log('ERROR: ' + e.message);
                      res.status(500);
                      res.send("Whoops! Something went wrong :(");
                    });

                }
            }
        })

        app.get('/signup', function (req, res) {
           res.sendFile( __dirname + "/views/" + "signup.html" );
        })

        app.post('/signup', function (req, res) {
            let email = req.body.email;
            if (!email) {
                res.statusCode = 400;
                res.send('You need to provide an email');
            }
            let password = req.body.password;
            if (!password) {
                res.statusCode = 400;
                res.send('You need to provide a password');
            }
            userManagement.signup(email, password).then(function (user) {
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
            let email = req.body.email;
            if (!email) {
                res.statusCode = 400;
                res.send('You need to provide an email');
            }
            let password = req.body.password;
            if (!password) {
                res.statusCode = 400;
                res.send('You need to provide a password');
            }
            userManagement.login(email, password).then(function (data) {
                let sessionId = data.sessionId;
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
            const sessionId = req.cookies[sessionCookieKey];
            console.log("session id received from browser: " + sessionId);
            if (!sessionId) {
                res.redirect('/login');
            } else {
                const username = userManagement.getLoggedInUser(sessionId);
                if (username == null) {
                    res.cookie(sessionCookieKey, "", {
                        path: '/',
                        expires: new Date(1)
                    });
                    res.redirect('/login')
                } else {
                    let loggedInUser = new auth.LoggedInUser(new auth.User(username), sessionId);
                    userManagement.logout(loggedInUser);
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
            let email = req.body.email;
            if (!email) {
                res.statusCode = 400;
                res.send('You need to provide an email');
            }
            userManagement.forgotPassword(email, res).then(function (data) {
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
            let verificationCode = req.body.verificationCode;
            if (!verificationCode) {
                res.statusCode = 400;
                res.send('You need to provide a verification code');
            }
            let email = req.body.email;
            if (!email) {
                res.statusCode = 400;
                res.send('You need to provide an email');
            }
            let newPassword = req.body.newPassword;
            if (!newPassword) {
                res.statusCode = 400;
                res.send('You need to provide a new password');
            }
            userManagement.resetPassword(verificationCode, email, newPassword, res).then(function (data) {
                console.log('redirecting')
                res.redirect('/login');
            }).catch(function (err) {
                console.log(err);
                res.status(500);
                res.send("Whoops! Something went wrong :(");
            });
        })
        return app
}

module.exports = createServer


