let AwsUserManagement = require('./aws/auth')
let propertiesReader = require('properties-reader');

let createServer = require('./server')

let args = process.argv.slice(2)
console.log(args)
if (args.length < 2) {
   throw new Error("Must provide user pool ID, client ID and optionally config file path. Raw args: " + process.argv)
}

let configFilePath;
if (args[2]) {
  configFilePath = args[2]
} else {
  // Default config location
  configFilePath = 'config/config.properties'
}

let properties = propertiesReader(configFilePath)
let backendConfig = {}
backendConfig.hostname = properties.get('backendHostname')
backendConfig.port = properties.get('backendPort')

console.log('Backend hostname: ' + backendConfig.hostname)
console.log('Backend port: ' + backendConfig.port)

let awsUserManagement = new AwsUserManagement(args[0], args[1])

let server = createServer(awsUserManagement, backendConfig)

let serverListening = server.listen(8080, function () {
	let host = serverListening.address().address
	let port = serverListening.address().port
	console.log("App is listening at http://%s:%s", host, port)
})
