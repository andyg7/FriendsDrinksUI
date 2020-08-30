var AwsUserManagement = require('./aws/auth')

let ServerFactory = require('./server')

let args = process.argv.slice(2);
console.log(args)
if (args.length != 2) {
        throw new Error("Must provide user pool ID and client ID")
}

let awsUserManagement = new AwsUserManagement(args[0], args[1])

let serverFactory = new ServerFactory(awsUserManagement)
let server = serverFactory.createServer();

var serverListening = server.listen(8080, function () {
	let host = serverListening.address().address
	let port = serverListening.address().port
	console.log("Example app listening at http://%s:%s", host, port)
})
