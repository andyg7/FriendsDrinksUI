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
                        resolve(body);
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
                    reject(new Error("Failed to call backend"));
                }

                let bodyChunks = [];
                backendRes.on('data', function (chunk) {
                    bodyChunks.push(chunk);
                }).on('end', function () {
                    let body = Buffer.concat(bodyChunks);
                    console.log('BODY: ' + body);
                    resolve(body);
                })
            });

            backendReq.on('error', function (e) {
                console.log('ERROR: ' + e.message);
                reject(new Error("Failed to call backend"));
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
                    resolve(body);
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

    updateFriendsDrinks(friendsDrinksId, name) {
        let postObj = {
            adminUserId: userId,
            name: name
        }
        let path = "/v1/friendsdrinkses/" + friendsDrinksId;

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

        return httpPromise(options, postData);
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
        return httpPromise(options, postData);
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

        return httpPromise(options, postData);
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

         return httpPromise(options, postData);
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
                    resolve(body);
                })

            })

            backendReq.on('error', function (e) {
                console.log('ERROR: ' + e.message);
                reject(new Error("Failed to call backend"));
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
                    resolve(body);
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

        return httpPromise(options, postData);
    }

    httpPromise(options, postData) {
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
                        resolve(body);
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