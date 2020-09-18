let AwsUserManagement = require('./aws/auth')
let propertiesReader = require('properties-reader');

let createServer = require('./server')

let args = process.argv.slice(2)
console.log(args)
if (args.length < 3) {
   throw new Error("Must provide user pool ID, client ID, stage and optionally backend port. Raw args: " + process.argv)
}

let properties = propertiesReader('src/config/config.properties');
let backendConfig = {}
backendConfig.hostname = properties.get(args[2] + '.' + 'backendHostname')

console.log('Port from config file: ' + properties.get(args[2] + '.' + 'backendPort'))
console.log('Port from command line: ' + args[3])
if (properties.get(args[2] + '.' + 'backendPort')) {
    backendConfig.port = properties.get(args[2] + '.' + 'backendPort')
} else if (args[3]) {
    backendConfig.port = args[3]
} else {
    throw new Error("Must provide backend port via either the src/config/config.properties file or the command line")
}

console.log('Backend hostname: ' + backendConfig.hostname)
console.log('Backend port: ' + backendConfig.port)

let awsUserManagement = new AwsUserManagement(args[0], args[1])

let server = createServer(awsUserManagement, backendConfig)

let serverListening = server.listen(8080, function () {
	let host = serverListening.address().address
	let port = serverListening.address().port
	console.log("App is listening at http://%s:%s", host, port)
})
