var AwsUserManagement = require('./aws/auth')
var propertiesReader = require('properties-reader');

let createServer = require('./server')

let args = process.argv.slice(2);
console.log(args)
if (args.length != 3) {
   throw new Error("Must provide user pool ID, client ID and stage. Raw args: " + process.argv)
}

var properties = propertiesReader('src/config/config.properties');
let backendConfig = {}
backendConfig.hostname = properties.get(args[2] + '.' + 'backendHostname')
backendConfig.port = properties.get(args[2] + '.' + 'backendPort')
console.log('Backend hostname: ' + backendConfig.hostname)
console.log('Backend port: ' + backendConfig.port)

let awsUserManagement = new AwsUserManagement(args[0], args[1])

let server = createServer(awsUserManagement, backendConfig)

var serverListening = server.listen(8080, function () {
	let host = serverListening.address().address
	let port = serverListening.address().port
	console.log("Example app listening at http://%s:%s", host, port)
})
