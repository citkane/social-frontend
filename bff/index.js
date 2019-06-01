'use strict';

const path = require('path');
const proxy = require('express-http-proxy');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { path: '/ws' });
const ioWildcard  = require('socketio-wildcard')();
const zmq = require('zmq');

const sock = zmq.socket('push');
 
sock.bindSync('tcp://192.168.0.104:4000');
console.log('Producer bound to port 4000');

let count = 0;
setInterval(function(){
	sock.send('some work ' + count);
	count++;
}, 500);

io.use(ioWildcard);
io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', (reason) => {
		console.log('A user disconnected', reason);
	});
	
	socket.on('*', (foo) => {
		console.log(foo.data);
	})
	
});

app.use('/img', proxy('localhost:3010'));
app.get('/socket.io', function(req, res){
  res.sendFile(path.join(__dirname, 'node_modules/socket.io-client/dist/socket.io.js'));
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});