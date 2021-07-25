let AwsUserManagement = require('./aws/auth')
let HttpCookieExtractor = require('./http/cookie')
let DevUserManagement = require('./dev/auth')
let DevCookieExtractor = require('./dev/cookie')
let propertiesReader = require('properties-reader');
const fs = require('fs');

const SESSION_KEY = "friendsdrinks-session-id";

let createServer = require('./server')

let argv = require('minimist')(process.argv.slice(2));
console.log(argv)

let configFile;
if (argv['_'][0]) {
  configFile = argv['_'][0]
} else {
      throw new Error("Must provide location of configuration file")
}

let properties = propertiesReader(configFile)
// looping through the properties reader
properties.each((key, value) => {
  // called for each item in the reader,
  // first with key=main.some.thing, value=foo
  // next with key=blah.some.thing, value=bar
  console.log("Key: " + key + ". Value: " + value)
});
let backendConfig = {}
backendConfig.hostname = properties.get('backendHostname')
backendConfig.port = properties.get('backendPort')

console.log('Backend hostname: ' + backendConfig.hostname)
console.log('Backend port: ' + backendConfig.port)

let userManagement = null;
let cookieExtractor = null;
if (properties.get('identity_store') == 'dev') {
    userManagement = new DevUserManagement()
    cookieExtractor = new DevCookieExtractor()
    console.log('Dev stage')
} else {
    let clientIdFile = properties.get('clientIdFile')
    let userPoolIdFile = properties.get('userPoolIdFile')
    const clientId = fs.readFileSync(clientIdFile, {encoding:'utf8', flag:'r'});
    console.log("Client ID:" + clientId)
    const userPoolId = fs.readFileSync(userPoolIdFile, {encoding:'utf8', flag:'r'});
    console.log("User pool ID:" + userPoolId)
    userManagement = new AwsUserManagement(userPoolId, clientId)
    cookieExtractor = new HttpCookieExtractor(SESSION_KEY)
}

let server = createServer(userManagement, cookieExtractor, backendConfig, SESSION_KEY)
let serverListening = server.listen(8080, function () {
	let host = serverListening.address().address
	let port = serverListening.address().port
	console.log("App is listening at http://%s:%s", host, port)
})
