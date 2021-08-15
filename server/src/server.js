global.fetch = require('node-fetch');

let http = require('http');
let express = require('express');
let auth = require('./auth');
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')


const INTERNAL_ERROR_MESSAGE = "Whoops! Something went wrong :(";

function createServer(userManagement, cookieExtractor, backendConfig, backend, sessionKey) {
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
        res.send("Success!");
        return;
    })

    app.get('/friendsdrinksinvitations/:friendsDrinksId', function (req, res) {
        let sessionId = cookieExtractor.getSessionId(req)
        if (sessionId === null) {
            res.redirect('/login');
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            resetHttpResponseCookieAndRedirect(res)
            return;
        }
        let userId = user.userId
        if (!userId) {
            throw new Error("userId should never be undefined or null")
        }

        let friendsDrinksId = req.params.friendsDrinksId
        let options = {
            host: backendHostname,
            port: backendPort,
            path: "/v1/friendsdrinksinvitations/users/" + userId + "/friendsdrinkses/" + friendsDrinksId
        }

        let backendReq = http.get(options, function (backendRes) {
            console.log('STATUS: ' + backendRes.statusCode);
            console.log('HEADERS: ' + JSON.stringify(backendRes.headers));
            if (backendRes.statusCode !== 200) {
                backendRes.resume();
                res.status(500);
                res.send(INTERNAL_ERROR_MESSAGE);
                return;
            }

            let bodyChunks = [];
            backendRes.on('data', function (chunk) {
                bodyChunks.push(chunk);
            }).on('end', function () {
                let body = Buffer.concat(bodyChunks);
                console.log('BODY: ' + body);
                let obj = JSON.parse(body);

                res.render('friendsdrinks_invitation', {
                    message: obj.message,
                    friendsDrinksId: obj.friendsDrinksId,
                    friendsDrinksName: obj.friendsDrinksName
                });

            })

        })

        backendReq.on('error', function (e) {
            console.log('ERROR: ' + e.message);
            res.status(500);
            res.send(INTERNAL_ERROR_MESSAGE);
            return;
        });

    })

    app.get('/friendsdrinksdetailpages/:friendsDrinksId', function (req, res) {
        let sessionId = cookieExtractor.getSessionId(req)
        if (sessionId === null) {
            res.redirect('/login');
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            resetHttpResponseCookieAndRedirect(res)
            return;
        }
        let userId = user.userId
        if (!userId) {
            throw new Error("userId should never be undefined or null")
        }

        let friendsDrinksId = req.params.friendsDrinksId
        let options = {
            host: backendHostname,
            port: backendPort,
            path: "/v1/friendsdrinksdetailpages/" + friendsDrinksId
        }

        let backendReq = http.get(options, function (backendRes) {
            console.log('STATUS: ' + backendRes.statusCode);
            console.log('HEADERS: ' + JSON.stringify(backendRes.headers));
            if (backendRes.statusCode !== 200) {
                backendRes.resume();
                res.status(500);
                res.send(INTERNAL_ERROR_MESSAGE);
                return;
            }

            let bodyChunks = [];
            backendRes.on('data', function (chunk) {
                bodyChunks.push(chunk);
            }).on('end', function () {
                let body = Buffer.concat(bodyChunks);
                console.log('BODY: ' + body);
                let obj = JSON.parse(body);
                members = []
                if (obj.memberList && obj.memberList.length > 0) {
                    obj.memberList.forEach(function (item, index) {
                        members.push(
                            {
                                firstName: item.firstName,
                                lastName: item.lastName,
                                userId: item.userId
                            }
                        )
                    });
                }

                meetups = []
                if (obj.friendsDrinksDetailPageMeetupList && obj.friendsDrinksDetailPageMeetupList.length > 0) {
                    obj.friendsDrinksDetailPageMeetupList.forEach(function (item, index) {
                        meetups.push(
                            {
                                date: item.date
                            }
                        )
                    });
                }

                let isAdmin = false;
                if (userId === obj.adminUserId) {
                    isAdmin = true;
                }
                res.render('friendsdrinks_detail_page', {
                    userId: userId,
                    firstName: user.firstName,
                    name: obj.name,
                    members: members,
                    friendsDrinksId: friendsDrinksId,
                    isAdmin: isAdmin
                });
            })

        })

        backendReq.on('error', function (e) {
            console.log('ERROR: ' + e.message);
            res.status(500);
            res.send(INTERNAL_ERROR_MESSAGE);
            return;
        });

    })

    app.get('/v1/api/userhomepages', function (req, res) {
        let sessionId = cookieExtractor.getSessionId(req)
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
            throw new Error("userId should never be undefined or null")
        }
        let options = {
            host: backendHostname,
            port: backendPort,
            path: "/v1/userhomepages/" + userId
        };

        let backendReq = http.get(options, function (backendRes) {
            console.log('STATUS: ' + backendRes.statusCode);
            console.log('HEADERS: ' + JSON.stringify(backendRes.headers));
            if (backendRes.statusCode !== 200) {
                backendRes.resume();
                res.status(500);
                res.send(INTERNAL_ERROR_MESSAGE);
                return;
            }

            let bodyChunks = [];
            backendRes.on('data', function (chunk) {
                bodyChunks.push(chunk);
            }).on('end', function () {
                let body = Buffer.concat(bodyChunks);
                console.log('BODY: ' + body);
                let obj = JSON.parse(body);

                friendsDrinks = []
                if (obj.adminFriendsDrinksStateList && obj.adminFriendsDrinksStateList.length > 0) {
                    obj.adminFriendsDrinksStateList.forEach(function (item, index) {
                        friendsDrinks.push(
                            {
                                id: item.friendsDrinksId,
                                name: item.name,
                                type: "ADMIN"
                            }
                        )
                    });
                }

                if (obj.memberFriendsDrinksStateList && obj.memberFriendsDrinksStateList.length > 0) {
                    obj.memberFriendsDrinksStateList.forEach(function (item, index) {
                        friendsDrinks.push(
                            {
                                id: item.friendsDrinksId,
                                name: item.name,
                                type: "MEMBER"
                            }
                        )
                    });
                }

                invitations = []
                if (obj.invitationList && obj.invitationList.length > 0) {
                    obj.invitationList.forEach(function (item, index) {
                        invitations.push(
                            {
                                message: item.message,
                                friendsDrinksName: item.friendsDrinksName,
                                friendsDrinksUuid: item.friendsDrinksId
                            }
                        )
                    });
                }

                res.render('user_homepage', {
                    firstName: user.firstName,
                    friendsDrinks: friendsDrinks,
                    invitations: invitations
                });
            })
        });

        backendReq.on('error', function (e) {
            console.log('ERROR: ' + e.message);
            res.status(500);
            res.send(INTERNAL_ERROR_MESSAGE);
            return;
        });
    });

    app.get('/', function (req, res) {
        let sessionId = cookieExtractor.getSessionId(req)
        if (sessionId === null) {
            res.redirect('/login');
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            resetHttpResponseCookieAndRedirect(res)
            return;
        }
        let userId = user.userId
        if (!userId) {
            throw new Error("userId should never be undefined or null")
        }
        let options = {
            host: backendHostname,
            port: backendPort,
            path: "/v1/userhomepages/" + userId
        };

        let backendReq = http.get(options, function (backendRes) {
            console.log('STATUS: ' + backendRes.statusCode);
            console.log('HEADERS: ' + JSON.stringify(backendRes.headers));
            if (backendRes.statusCode !== 200) {
                backendRes.resume();
                res.status(500);
                res.send(INTERNAL_ERROR_MESSAGE);
                return;
            }

            let bodyChunks = [];
            backendRes.on('data', function (chunk) {
                bodyChunks.push(chunk);
            }).on('end', function () {
                let body = Buffer.concat(bodyChunks);
                console.log('BODY: ' + body);
                let obj = JSON.parse(body);

                friendsDrinks = []
                if (obj.adminFriendsDrinksStateList && obj.adminFriendsDrinksStateList.length > 0) {
                    obj.adminFriendsDrinksStateList.forEach(function (item, index) {
                        friendsDrinks.push(
                            {
                                id: item.friendsDrinksId,
                                name: item.name,
                                type: "ADMIN"
                            }
                        )
                    });
                }

                if (obj.memberFriendsDrinksStateList && obj.memberFriendsDrinksStateList.length > 0) {
                    obj.memberFriendsDrinksStateList.forEach(function (item, index) {
                        friendsDrinks.push(
                            {
                                id: item.friendsDrinksId,
                                name: item.name,
                                type: "MEMBER"
                            }
                        )
                    });
                }

                invitations = []
                if (obj.invitationList && obj.invitationList.length > 0) {
                    obj.invitationList.forEach(function (item, index) {
                        invitations.push(
                            {
                                message: item.message,
                                friendsDrinksName: item.friendsDrinksName,
                                friendsDrinksUuid: item.friendsDrinksId
                            }
                        )
                    });
                }

                res.render('user_homepage', {
                    firstName: user.firstName,
                    friendsDrinks: friendsDrinks,
                    invitations: invitations
                });
            })
        });

        backendReq.on('error', function (e) {
            console.log('ERROR: ' + e.message);
            res.status(500);
            res.send(INTERNAL_ERROR_MESSAGE);
            return;
        });

    })

    app.post('/friendsdrinks/schedule/:friendsDrinksId', function (req, res) {
        let sessionId = cookieExtractor.getSessionId(req)
        if (sessionId === null) {
            res.redirect('/login')
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            resetHttpResponseCookieAndRedirect(res)
            return;
        }
        let userId = user.userId
        if (!userId) {
            throw new Error("userId should never be undefined or null")
        }
        let friendsDrinksId = req.params.friendsDrinksId,
            path = "/v1/friendsdrinkses/" + friendsDrinksId + "/meetups"
        let postObj = {
            date: new Date().toISOString()
        }
        let postData = JSON.stringify(postObj)
        options = {
            host: backendHostname,
            port: backendPort,
            method: 'POST',
            path: path,
            headers: {
                'Content-Length': Buffer.byteLength(postData),
                'Content-Type': 'application/json'
            }
        }

        let backendReq = buildHttpRequest(options, res)

        console.log("Sending POST request", options)
        console.log("Sending postData", postData)
        backendReq.write(postData);
        backendReq.end();
        return;
    })

    app.post('/friendsdrinks/delete/:friendsDrinksId', function (req, res) {
        let sessionId = cookieExtractor.getSessionId(req)
        if (sessionId === null) {
            res.redirect('/login')
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            resetHttpResponseCookieAndRedirect(res)
            return;
        }
        let userId = user.userId
        if (!userId) {
            throw new Error("userId should never be undefined or null")
        }
        let friendsDrinksId = req.params.friendsDrinksId,
            path = "/v1/friendsdrinkses/" + friendsDrinksId
        options = {
            host: backendHostname,
            port: backendPort,
            method: 'DELETE',
            path: path
        }

        let backendReq = http.request(options, function (backendRes) {
            console.log('STATUS:' + backendRes.statusCode);
            console.log('HEADERS: ' + JSON.stringify(backendRes.headers));
            if (backendRes.statusCode !== 200) {
                backendRes.resume();
                res.status(500);
                res.send(INTERNAL_ERROR_MESSAGE);
                return;
            }
            let bodyChunks = [];
            backendRes.on('data', (chunk) => {
                bodyChunks.push(chunk)
            });
            backendRes.on('end', () => {
                let body = Buffer.concat(bodyChunks);
                console.log('BODY: ' + body);
                let obj = JSON.parse(body);
                console.log('Result ', obj.result);

                console.log('No more data in response - redirecting to /');
                res.redirect('/')
                return;
            });

        })

        backendReq.on('error', function (e) {
            console.log('ERROR: ' + e.message);
            res.status(500);
            res.send(INTERNAL_ERROR_MESSAGE);
            return;
        });

        console.log("Sending DELETE request", options)
        backendReq.end();
        return;
    })

    app.post('/friendsdrinks/inviteUser/:friendsDrinksId', function (req, res) {
        let sessionId = cookieExtractor.getSessionId(req)
        if (sessionId === null) {
            res.redirect('/login')
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            resetHttpResponseCookieAndRedirect(res)
            return
        }
        let userId = user.userId
        if (!userId) {
            throw new Error("userId should never be undefined or null")
        }

        let postObj = {
            userId: userId,
            friendsDrinksId: req.params.friendsDrinksId,
            requestType: 'INVITE_USER',
            inviteUserRequest: {
                userId: req.body.userId
            }
        }
        let path = "/v1/friendsdrinksmemberships"

        let postData = JSON.stringify(postObj)

        let options = {
            host: backendHostname,
            port: backendPort,
            path: path,
            method: 'POST',
            headers: {
                'Content-Length': Buffer.byteLength(postData),
                'Content-Type': 'application/json'
            }
        };

        let backendReq = buildHttpRequest(options, res)

        console.log("Sending request", postData)
        backendReq.write(postData);
        backendReq.end();
        return;
    })

    app.post('/friendsdrinks/replyToInvitation/:friendsDrinksId', function (req, res) {
        let sessionId = cookieExtractor.getSessionId(req)
        if (sessionId === null) {
            res.redirect('/login')
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            resetHttpResponseCookieAndRedirect(res)
            return
        }
        let userId = user.userId
        if (!userId) {
            throw new Error("userId should never be undefined or null")
        }
        let postObj = {
            userId: userId,
            friendsDrinksId: req.params.friendsDrinksId,
            requestType: 'REPLY_TO_INVITATION',
            replyToInvitationRequest: {
                response: req.body.invitationReply
            }
        }
        let path = "/v1/friendsdrinksmemberships"

        let postData = JSON.stringify(postObj)

        let options = {
            host: backendHostname,
            port: backendPort,
            path: path,
            method: 'POST',
            headers: {
                'Content-Length': Buffer.byteLength(postData),
                'Content-Type': 'application/json'
            }
        };

        let backendReq = buildHttpRequest(options, res)

        console.log("Sending request", postData, " to ", path)
        backendReq.write(postData);
        backendReq.end();
        return;
    })


    app.post('/friendsdrinks/create', function (req, res) {
        let sessionId = cookieExtractor.getSessionId(req)
        if (sessionId === null) {
            res.redirect('/login')
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            resetHttpResponseCookieAndRedirect(res)
            return;
        }
        console.log("logged in user", user)
        let userId = user.userId
        if (!userId) {
            throw new Error("userId should never be undefined or null")
        }
        let path = "/v1/friendsdrinkses/"
        let postObj = {
            adminUserId: userId,
            name: req.body.name
        }
        let postData = JSON.stringify(postObj)
        let options = {
            host: backendHostname,
            port: backendPort,
            path: path,
            method: 'POST',
            headers: {
                'Content-Length': Buffer.byteLength(postData),
                'Content-Type': 'application/json'
            }
        };
        let backendReq = buildHttpRequest(options, res)

        console.log("Sending request", postData)
        backendReq.write(postData);
        backendReq.end();
        return;
    })

    app.post('/friendsdrinks/update', function (req, res) {
        let sessionId = cookieExtractor.getSessionId(req)
        if (sessionId === null) {
            res.redirect('/login')
            return;
        }
        let user = userManagement.getLoggedInUser(sessionId);
        if (user === null) {
            resetHttpResponseCookieAndRedirect(res)
            return;
        }
        let userId = user.userId
        if (!userId) {
            throw new Error("userId should never be undefined or null")
        }
        let postObj = {
            adminUserId: userId,
            name: req.body.name
        }
        let path = "/v1/friendsdrinkses/" + req.body.id

        let postData = JSON.stringify(postObj)

        let options = {
            host: backendHostname,
            port: backendPort,
            path: path,
            method: 'POST',
            headers: {
                'Content-Length': Buffer.byteLength(postData),
                'Content-Type': 'application/json'
            }
        };

        let backendReq = buildHttpRequest(options, res)

        console.log("Sending request", postData)
        backendReq.write(postData);
        backendReq.end();
        return;
    })

    function buildHttpRequest(options, res) {
        let backendReq = http.request(options, function (backendRes) {
            console.log('STATUS: ' + backendRes.statusCode);
            console.log('HEADERS: ' + JSON.stringify(backendRes.headers));
            if (backendRes.statusCode !== 200) {
                backendRes.resume();
                res.status(500);
                res.send(INTERNAL_ERROR_MESSAGE);
                return;
            } else {
                console.log("got 200")
                let bodyChunks = [];
                backendRes.on('data', (chunk) => {
                    bodyChunks.push(chunk)
                });
                backendRes.on('end', () => {
                    let body = Buffer.concat(bodyChunks);
                    console.log('BODY: ' + body);
                    let obj = JSON.parse(body);
                    console.log('Result ', obj.result);

                    console.log('No more data in response - redirecting to /');
                    res.redirect('/')
                    return;
                });
            }
        });

        backendReq.on('error', function (e) {
            console.log('ERROR: ' + e.message);
            res.status(500);
            res.send(INTERNAL_ERROR_MESSAGE);
            return;
        });

        return backendReq;
    }

    app.post('/v1/api/signup', function (req, res) {
        let email = req.body.email;
        if (!email) {
            res.statusCode = 400;
            res.send(JSON.stringify({errMsg: 'You need to provide an email' }));
            return;
        }
        let password = req.body.password;
        if (!password) {
            res.statusCode = 400;
            res.send(JSON.stringify({errMsg: 'You need to provide a password' }));
            return;
        }
        let firstName = req.body.firstName;
        if (!firstName) {
            res.statusCode = 400;
            res.send(JSON.stringify({errMsg: 'You need to provide a first name' }));
            return;
        }
        let lastName = req.body.lastName;
        if (!lastName) {
            res.statusCode = 400;
            res.send(JSON.stringify({errMsg: 'You need to provide a last name' }));
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
            res.send(JSON.stringify({ errMsg: 'You need to provide an email' }));
            return;
        }
        userManagement.login(email, password).then(function (data) {
            console.log("Successfully logged in " + email);
            let sessionId = data.sessionId;
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
                res.send(JSON.stringify({ sId: sessionId }));
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
        let sessionId = cookieExtractor.getSessionId(req)
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
            res.send(JSON.stringify({errMsg: 'You need to provide an email' }));
            return;
        }
        userManagement.forgotPassword(email, res).then(function (data) {
            res.status(200);
            res.send('{}');
            return;
        }).catch(function (err) {
            console.log(err);
            res.status(500);
            res.send(JSON.stringify({errMsg: INTERNAL_ERROR_MESSAGE }));
            return;
        });
    })

    app.post('/v1/api/resetpassword', function (req, res) {
        let verificationCode = req.body.verificationCode;
        if (!verificationCode) {
            res.statusCode = 400;
            res.send('You need to provide a verification code');
            return;
        }

        let email = req.body.email;
        if (!email) {
            res.statusCode = 400;
            res.send('You need to provide a password');
            return;
        }

        let newPassword = req.body.newPassword;
        if (!newPassword) {
            res.statusCode = 400;
            res.send('You need to provide a new password');
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

    function resetHttpResponseCookieAndRedirect(res) {
        console.log("Resetting http cookies")
        res.cookie(sessionKey, "", {
            path: '/',
            expires: new Date(1)
        });
        res.redirect('/login')
    }

    return app
}

module.exports = createServer


