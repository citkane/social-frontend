

const path = require('path');
const proxy = require('express-http-proxy');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { path: '/ws' });
const ioWildcard = require('socketio-wildcard')();
const zmq = require('zmq');

const reqResPort = 4000;

function reqRes(message) {
    const requester = zmq.socket('req');
    requester.connect(`tcp://127.0.0.1:${reqResPort}`);

    let promise;
    requester.on('message', (msg) => {
        const m = msg.toString();
        promise.resolve(m);
        requester.close();
    });
    return new Promise((resolve, reject) => {
        promise = { resolve, reject };
        requester.send(message);
    });
}

io.use(ioWildcard);
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', (reason) => {
        console.log('A user disconnected', reason);
    });

    socket.on('test', (foo) => {
        console.log(foo.data);
        reqRes(foo.data).then(() => {
            console.log(foo);
        });
    });
});

app.use('/img', proxy('localhost:3010'));
app.get('/socket.io/:fileName', (req, res) => {
    const { fileName } = req.params;
    res.sendFile(path.join(__dirname, 'node_modules/socket.io-client/dist', fileName));
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
