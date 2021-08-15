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
}

module.exports = Backend