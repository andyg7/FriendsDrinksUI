var AwsUserManagement = require('./aws/auth')

let createServer = require('./server')

let args = process.argv.slice(2);
console.log(args)
if (args.length < 4) {
   throw new Error("Must provide user pool ID, client ID, backend hostname and backend port. Raw args: " + process.argv)
}

let awsUserManagement = new AwsUserManagement(args[0], args[1])

let backendConfig = {}
backendConfig.hostname = args[2]
backendConfig.port = args[3]

let server = createServer(awsUserManagement, backendConfig)

var serverListening = server.listen(8080, function () {
	let host = serverListening.address().address
	let port = serverListening.address().port
	console.log("Example app listening at http://%s:%s", host, port)
})
