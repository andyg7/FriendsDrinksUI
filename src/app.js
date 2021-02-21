let AwsUserManagement = require('./aws/auth')
let propertiesReader = require('properties-reader');
const fs = require('fs');

let createServer = require('./server')

const defaultConfigPath = 'config/config.properties'

let argv = require('minimist')(process.argv.slice(2));
console.log(argv)

let configPath;
if (argv['config-path']) {
  configPath = argv['config-path']
} else {
  // Default config location
  configPath = defaultConfigPath;
}

let properties = propertiesReader(configPath)
let backendConfig = {}
backendConfig.hostname = properties.get('backendHostname')
backendConfig.port = properties.get('backendPort')

let defaultClientIdPath = properties.get('clientIdPath')
let defaultUserPoolIdPath = properties.get('userPoolIdPath')

console.log('Backend hostname: ' + backendConfig.hostname)
console.log('Backend port: ' + backendConfig.port)

let clientIdPath;
if (argv['client-id-path']) {
  clientIdPath = argv['client-id-path']
} else {
  // Default config location
  clientIdPath = defaultClientIdPath
}
const clientId = fs.readFileSync(clientIdPath, {encoding:'utf8', flag:'r'});
console.log("Client ID:" + clientId)

let userPoolIdPath;
if (argv['user-pool-id-path']) {
  userPoolIdPath = argv['user-pool-id-path']
} else {
  // Default config location
  userPoolIdPath = defaultUserPoolIdPath
}
const userPoolId = fs.readFileSync(userPoolIdPath, {encoding:'utf8', flag:'r'});
console.log("User pool ID:" + userPoolId)

let awsUserManagement = new AwsUserManagement(userPoolId, clientId)
let server = createServer(awsUserManagement, backendConfig)
let serverListening = server.listen(8080, function () {
	let host = serverListening.address().address
	let port = serverListening.address().port
	console.log("App is listening at http://%s:%s", host, port)
})
