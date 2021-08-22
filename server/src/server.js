global.fetch = require('node-fetch');

let express = require('express');
let auth = require('./auth');
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')


const INTERNAL_ERROR_MESSAGE = "Whoops! Something went wrong :(";

function createServer(userManagement, sessionIdExtractor, backendConfig, backend, sessionKey) {
    let app = express();

    // app.set('views', __dirname + '/views');
    // app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(express.static(__dirname + '/public'));
    app.use(function (req, res, next) {
        console.log("Incoming request:", req.method, req.url, req.body, req.cookies);
        next();
    });

    let backendHostname = backendConfig.hostname
    let backendPort = backendConfig.port

    app.get('/v1/health', function (req, res) {
        res.send(JSON.stringify({ status: "HEALTHY" }));
        return;
    })

    app.get('/v1/api/friendsdrinksinvitations/:friendsDrinksId', function (req, res) {
        let sessionId = sessionIdExtractor.getSessionId(req)
        if (sessionId === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        let userId = user.userId
        if (!userId) {
            console.log("userId should never be undefined or null");
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        }

        let friendsDrinksId = req.params.friendsDrinksId
        backend.getFriendsDrinksInvitation(userId, friendsDrinksId).then(function (data) {
            res.status(200);
            res.send(data);
        }).catch(function (err) {
            console.log(err);
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        });

    })

    app.get('/v1/apifriendsdrinksdetailpages/:friendsDrinksId', function (req, res) {
        let sessionId = sessionIdExtractor.getSessionId(req)
        if (sessionId === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        let userId = user.userId
        if (!userId) {
            console.log("userId should never be undefined or null");
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        }

        let friendsDrinksId = req.params.friendsDrinksId
        backend.getFriendsDrinksDetailPage(friendsDrinksId).then(function (data) {
            res.status(200);
            res.send(data);
        }).catch(function (err) {
            console.log(err);
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        });
    })

    app.get('/v1/api/userhomepages/:sessionId', function (req, res) {
        let sessionId = req.params.sessionId;
        if (sessionId === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        let userId = user.userId
        if (!userId) {
            console.log("userId should never be undefined or null");
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        }
        backend.getHomepage(userId).then(function (data) {
            res.status(200);
            res.send(data);
        }).catch(function (err) {
            console.log(err);
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        });

    });

    app.post('/v1/api/friendsdrinks/schedule/:friendsDrinksId', function (req, res) {
        let sessionId = sessionIdExtractor.getSessionId(req)
        if (sessionId === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        let userId = user.userId
        if (!userId) {
            console.log("userId should never be undefined or null");
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        }
        let friendsDrinksId = req.params.friendsDrinksId;
        backend.schedule(friendsDrinksId).then(function (data) {
            res.status(200);
            res.send('{}');
            return;
        }).catch(function (error) {
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        });

    })

    app.post('/v1/api/friendsdrinks/delete/:friendsDrinksId', function (req, res) {
        let sessionId = sessionIdExtractor.getSessionId(req)
        if (sessionId === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        let userId = user.userId
        if (!userId) {
            console.log("userId should never be undefined or null");
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        }
        let friendsDrinksId = req.params.friendsDrinksId
        backend.deleteFriendsDrinks(friendsDrinksId).then(function (data) {
            res.status(200);
            res.send('{}');
            return;
        }).catch(function (error) {
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        });
    })

    app.post('/v1/api/friendsdrinks/update', function (req, res) {
        let sessionId = sessionIdExtractor.getSessionId(req)
        if (sessionId === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        let userId = user.userId
        if (!userId) {
            console.log("userId should never be undefined or null");
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        }
        backend.updateFriendsDrinks(friendsDrinksId).then(function (data) {
            res.status(200);
            res.send('{}');
            return;
        }).catch(function (error) {
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        });
    })

    app.post('/v1/api/friendsdrinks/inviteUser/:friendsDrinksId', function (req, res) {
        let sessionId = sessionIdExtractor.getSessionId(req)
        if (sessionId === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return
        }
        let userId = user.userId
        if (!userId) {
            console.log("userId should never be undefined or null");
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        }
        backend.inviteUser(req.params.friendsDrinksId, req.body.userId).then(function (data) {
            res.status(200);
            res.send('{}');
            return;
        }).catch(function (error) {
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        });

    })

    app.post('/friendsdrinks/replyToInvitation/:friendsDrinksId', function (req, res) {
        let sessionId = sessionIdExtractor.getSessionId(req)
        if (sessionId === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return
        }
        let userId = user.userId
        if (!userId) {
            console.log("userId should never be undefined or null");
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        }
        backend.replyToInvitation(req.params.friendsDrinksId, req.body.invitationReply).then(function (data) {
            res.status(200);
            res.send('{}');
            return;
        }).catch(function (error) {
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        });

    })


    app.post('/v1/api/friendsdrinks/create', function (req, res) {
        let sessionId = sessionIdExtractor.getSessionId(req)
        if (sessionId === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        console.log("logged in user", user)
        let userId = user.userId
        if (!userId) {
            console.log("userId should never be undefined or null");
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        }
        backend.createFriendsDrinks(userId, req.body.name).then(function (data) {
            res.status(200);
            res.send('{}');
            return;
        }).catch(function (error) {
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        });

    })



    // API. Accepts JSON and returns JSON.
    app.post('/v1/api/signup', function (req, res) {
        let email = req.body.email;
        if (!email) {
            res.statusCode = 400;
            res.send(JSON.stringify({ errMsg: 'You need to provide an email' }));
            return;
        }
        let password = req.body.password;
        if (!password) {
            res.statusCode = 400;
            res.send(JSON.stringify({ errMsg: 'You need to provide a password' }));
            return;
        }
        let firstName = req.body.firstName;
        if (!firstName) {
            res.statusCode = 400;
            res.send(JSON.stringify({ errMsg: 'You need to provide a first name' }));
            return;
        }
        let lastName = req.body.lastName;
        if (!lastName) {
            res.statusCode = 400;
            res.send(JSON.stringify({ errMsg: 'You need to provide a last name' }));
            return;
        }
        input = {
            email: email,
            password: password,
            firstname: firstName,
            lastname: lastName
        }
        userManagement.signUp(input).then(function (email) {
            res.status(200);
            res.send('{}');
            return;
        }).catch(function (err) {
            console.log(err);
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        });
    })

    app.post('/v1/api/login', function (req, res) {
        let email = req.body.email;
        if (!email) {
            res.statusCode = 400;
            res.send(JSON.stringify({ errMsg: 'You need to provide an email' }));
            return;
        }
        let password = req.body.password;
        if (!password) {
            res.statusCode = 400;
            res.send(JSON.stringify({ errMsg: 'You need to provide a password' }));
            return;
        }
        userManagement.login(email, password).then(function (data) {
            let sessionId = data.sessionId;
            const firstName = data.user.firstName;
            const lastName = data.user.lastName;
            let input = {
                userId: data.user.userId,
                eventType: 'LOGGED_IN',
                loggedInEvent: {
                    firstName: data.user.firstName,
                    lastName: data.user.lastName,
                    email: data.user.email,
                }
            }
            backend.reportUserEvent(input).then(function (data) {
                res.cookie(sessionKey, sessionId, {});
                res.status(200);
                res.send(JSON.stringify({
                    sId: sessionId,
                    firstName: firstName,
                    lastName: lastName
                })
                );
                return;
            }).catch(function (err) {
                console.log(err);
                res.status(500);
                res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
                return;
            })
        }).catch(function (err) {
            console.log(err);
            if (err.code === 'NotAuthorizedException') {
                res.status(403);
                res.send(JSON.stringify({ errMsg: 'Wrong password' }));
                return;
            } else {
                res.status(500);
                res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
                return;
            }
        });
    });

    app.post('/v1/api/logout', function (req, res) {
        let sessionId = sessionIdExtractor.getSessionId(req)
        if (sessionId === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            res.status(403);
            res.send(JSON.stringify({ errMsg: 'Not logged in.' }));
            return;
        }
        userManagement.logout(new auth.LoggedInUser(user, sessionId));

        input = {
            userId: user.userId,
            eventType: 'LOGGED_OUT'
        }
        backend.reportUserEvent(input).then(function (data) {
            res.cookie(sessionKey, sessionId, {});
            res.status(200);
            res.send(JSON.stringify({ sId: sessionId }));
            return;
        }).catch(function (err) {
            console.log(err);
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        })
    });

    app.post('/v1/api/forgotpassword', function (req, res) {
        let email = req.body.email;
        if (!email) {
            res.statusCode = 400;
            res.send(JSON.stringify({ errMsg: 'You need to provide an email' }));
            return;
        }
        userManagement.forgotPassword(email, res).then(function (data) {
            res.status(200);
            res.send('{}');
            return;
        }).catch(function (err) {
            console.log(err);
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        });
    })

    app.post('/v1/api/resetpassword', function (req, res) {
        let verificationCode = req.body.verificationCode;
        if (!verificationCode) {
            res.statusCode = 400;
            res.send(JSON.stringify({ errMsg: 'You need to provide verification code' }));
            return;
        }

        let email = req.body.email;
        if (!email) {
            res.statusCode = 400;
            res.send(JSON.stringify({ errMsg: 'You need to provide an email' }));
            return;
        }

        let newPassword = req.body.newPassword;
        if (!newPassword) {
            res.statusCode = 400;
            res.send(JSON.stringify({ errMsg: 'You need to provide a new password' }));
            return;
        }

        userManagement.resetPassword(verificationCode, email, newPassword, res).then(function (data) {
            console.log('redirecting')
            res.status(200);
            res.send('{}');
            return;
        }).catch(function (err) {
            console.log(err);
            res.status(500);
            res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        });
    })


    return app
}

module.exports = createServer


