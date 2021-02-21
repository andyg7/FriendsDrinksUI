let AwsUserManagement = require('./aws/auth')
let propertiesReader = require('properties-reader');
const fs = require('fs');

let createServer = require('./server')

const defaultConfigFile = 'config/config.properties'

let argv = require('minimist')(process.argv.slice(2));
console.log(argv)

let configFile;
if (argv['config-file']) {
  configFile = argv['config-file']
} else {
  // Default config location
  configFile = defaultConfigFile;
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

let clientIdFile = properties.get('clientIdFile')
let userPoolIdFile = properties.get('userPoolIdFile')

console.log('Backend hostname: ' + backendConfig.hostname)
console.log('Backend port: ' + backendConfig.port)

const clientId = fs.readFileSync(clientIdFile, {encoding:'utf8', flag:'r'});
console.log("Client ID:" + clientId)

const userPoolId = fs.readFileSync(userPoolIdFile, {encoding:'utf8', flag:'r'});
console.log("User pool ID:" + userPoolId)

let awsUserManagement = new AwsUserManagement(userPoolId, clientId)
let server = createServer(awsUserManagement, backendConfig)
let serverListening = server.listen(8080, function () {
	let host = serverListening.address().address
	let port = serverListening.address().port
	console.log("App is listening at http://%s:%s", host, port)
})
