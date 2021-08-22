global.fetch = require('node-fetch');

let http = require('http');

class Backend {

    constructor(backendConfig) {
        this.backendHostname = backendConfig.hostname;
        this.backendPort = backendConfig.port;
    }

    reportUserEvent(input) {
        let postObj = {
            eventType: input.eventType
        }
        if (input.eventType === "LOGGED_IN") {
            postObj.loggedInEvent = input.loggedInEvent
        }
        let path = "/v1/users/" + input.userId
        let postData = JSON.stringify(postObj)
        let options = {
            host: this.backendHostname,
            port: this.backendPort,
            path: path,
            method: 'POST',
            headers: {
                'Content-Length': Buffer.byteLength(postData),
                'Content-Type': 'application/json'
            }
        };

        return new Promise(function (resolve, reject) {
            let backendReq = http.request(options, function (backendRes) {
                console.log('STATUS: ' + backendRes.statusCode);
                console.log('HEADERS: ' + JSON.stringify(backendRes.headers));
                if (backendRes.statusCode !== 200) {
                    backendRes.resume();
                    reject(new Error("Did not get a 200 back. instead got " + backendRes.statusCode));
                } else {
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
                        resolve("Success")
                    });
                }
            });

            backendReq.on('error', function (e) {
                console.log('ERROR: ' + e.message);
                reject(e)
                return;
            });

            console.log("Sending request", postData)
            backendReq.write(postData);
            backendReq.end();
        })
    }

    getHomepage(userId) {
        let options = {
            host: backendHostname,
            port: backendPort,
            path: "/v1/userhomepages/" + userId
        };

        return new Promise(function (resolve, reject) {
            let backendReq = http.get(options, function (backendRes) {
                console.log('STATUS: ' + backendRes.statusCode);
                console.log('HEADERS: ' + JSON.stringify(backendRes.headers));
                if (backendRes.statusCode !== 200) {
                    backendRes.resume();
                    res.status(500);
                    res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
                    return;
                }

                let bodyChunks = [];
                backendRes.on('data', function (chunk) {
                    bodyChunks.push(chunk);
                }).on('end', function () {
                    let body = Buffer.concat(bodyChunks);
                    console.log('BODY: ' + body);
                    resolve(body);

                    /*
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
                    */
                })
            });

            backendReq.on('error', function (e) {
                console.log('ERROR: ' + e.message);
                res.status(500);
                res.send(INTERNAL_ERROR_MESSAGE);
                return;
            });
        });
    }

    deleteFriendsDrinks(friendsDrinksId) {
        let path = "/v1/friendsdrinkses/" + friendsDrinksId
        options = {
            host: backendHostname,
            port: backendPort,
            method: 'DELETE',
            path: path
        }

        return new Promise(function (resolve, reject) {
            let backendReq = http.request(options, function (backendRes) {
                console.log('STATUS:' + backendRes.statusCode);
                console.log('HEADERS: ' + JSON.stringify(backendRes.headers));
                if (backendRes.statusCode !== 200) {
                    backendRes.resume();
                    reject(new Error("Failed to call backend"));
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
                    resolve('Success');
                });

            })

            backendReq.on('error', function (e) {
                console.log('ERROR: ' + e.message);
                reject(new Error("Failed to call backend"));
            });

            console.log("Sending DELETE request", options)
            backendReq.end();
        });
    }
    updateFriendsDrinks(friendsDrinksId) {
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

        return httpPromise(options);
    }

    createFriendsDrinks(userId, name) {
        let path = "/v1/friendsdrinkses/"
        let postObj = {
            adminUserId: userId,
            name: name
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
        return httpPromise(options):
    }

    replyToInvitation(friendsDrinksId, invitationReply) {
        let postObj = {
            userId: userId,
            friendsDrinksId: friendsDrinksId,
            requestType: 'REPLY_TO_INVITATION',
            replyToInvitationRequest: {
                response: invitationReply
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

        return httpPromise(options);
    }

    schedule(friendsDrinksId) {
        let path = "/v1/friendsdrinkses/" + friendsDrinksId + "/meetups";
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

         return httpPromise(options, res)
    }

    getFriendsDrinksDetailPage(friendsDrinksId) {
        let options = {
            host: backendHostname,
            port: backendPort,
            path: "/v1/friendsdrinksdetailpages/" + friendsDrinksId
        }

        return new Promise(function (resolve, reject) {
            let backendReq = http.get(options, function (backendRes) {
                console.log('STATUS: ' + backendRes.statusCode);
                console.log('HEADERS: ' + JSON.stringify(backendRes.headers));
                if (backendRes.statusCode !== 200) {
                    backendRes.resume();
                    reject(new Error("Failed to call backend"));
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
                    resolve(JSON.stringify({
                        userId: userId,
                        firstName: user.firstName,
                        name: obj.name,
                        members: members,
                        friendsDrinksId: friendsDrinksId,
                        isAdmin: isAdmin
                    }));
                })

            })

            backendReq.on('error', function (e) {
                console.log('ERROR: ' + e.message);
                res.status(500);
                res.send(JSON.stringify({ errMsg: INTERNAL_ERROR_MESSAGE }));
                return;
            });
        });

    }

    getFriendsDrinksInvitation(userId, friendsDrinksId) {
        let options = {
            host: backendHostname,
            port: backendPort,
            path: "/v1/friendsdrinksinvitations/users/" + userId + "/friendsdrinkses/" + friendsDrinksId
        }

        return new Promise(function (resolve, reject) {
            let backendReq = http.get(options, function (backendRes) {
                console.log('STATUS: ' + backendRes.statusCode);
                console.log('HEADERS: ' + JSON.stringify(backendRes.headers));
                if (backendRes.statusCode !== 200) {
                    backendRes.resume();
                    reject(new Error("Failed to call backend"));
                }

                let bodyChunks = [];
                backendRes.on('data', function (chunk) {
                    bodyChunks.push(chunk);
                }).on('end', function () {
                    let body = Buffer.concat(bodyChunks);
                    console.log('BODY: ' + body);
                    let obj = JSON.parse(body);

                    resolve(JSON.stringify({
                        message: obj.message,
                        friendsDrinksId: obj.friendsDrinksId,
                        friendsDrinksName: obj.friendsDrinksName
                    }));
                })

            })

            backendReq.on('error', function (e) {
                console.log('ERROR: ' + e.message);
                reject(new Error("Failed to call backend"));
            });
        });

    }

    inviteUser(friendsDrinksId, userId) {
        let postObj = {
            userId: userId,
            friendsDrinksId: friendsDrinksId,
            requestType: 'INVITE_USER',
            inviteUserRequest: {
                userId: userId
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

        return httpPromise(options);
    }

    httpPromise(options) {
        return new Promise(function (resolve, reject) {
            let backendReq = http.request(options, function (backendRes) {
                console.log('STATUS: ' + backendRes.statusCode);
                console.log('HEADERS: ' + JSON.stringify(backendRes.headers));
                if (backendRes.statusCode !== 200) {
                    backendRes.resume();
                    reject(new Error("Failed to send request"));
                } else {
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
                        resolve('Success');
                    });
                }
            });

            backendReq.on('error', function (e) {
                console.log('ERROR: ' + e.message);
                reject(new Error("Failed to send request"));
            });

            console.log("Sending request", postData)
            backendReq.write(postData);
            backendReq.end();
        });
    }
}

module.exports = Backend