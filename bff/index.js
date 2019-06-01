
'use strict';

const path = require('path');
const proxy = require('express-http-proxy');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { path: '/ws' });
const ioWildcard  = require('socketio-wildcard')();
const zmq = require('zmq');

const reqResPort = 4000;

function reqRes(message){
	const requester = zmq.socket('req');
	requester.connect('tcp://127.0.0.1:'+ reqResPort);
	
	let promise;
	requester.on('message', (msg) => {
		const message = msg.toString();
		promise.resolve(message);
		requester.close();
	});
	return new Promise((resolve, reject) => {
		promise = { resolve, reject };
		requester.send(message);
	});
}

/*
function send(message, count) {
	reqRes(message).then((response) => {
		console.log(count, response);
	})
}
let c = 0;
const test = setInterval(() => {
	const m = 'test:' + c	
	send(m, c);
	c++	
	if (c > 50) clearInterval(test);
}, Math.floor(Math.random() * Math.floor(10)) * 100)

let c2 = 0;
const test2 = setInterval(() => {
	const m = 'xxxx:' + c2	
	send(m, c2);
	c2++	
	if (c2 > 50) clearInterval(test2);
}, Math.floor(Math.random() * Math.floor(10)) * 100)
*/
io.use(ioWildcard);
io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', (reason) => {
		console.log('A user disconnected', reason);
	});
	
	socket.on('test', (foo) => {
		console.log(foo.data);
		reqRes(foo.data).then(() => {
			console.log(foo);
		});
	})	
});

app.use('/img', proxy('localhost:3010'));
app.get('/socket.io/:fileName', function(req, res){
	const fileName = req.params.fileName;
  	res.sendFile(path.join(__dirname, 'node_modules/socket.io-client/dist', fileName));
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});