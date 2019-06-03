const path = require('path');
const proxy = require('express-http-proxy');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { path: '/ws' });
const ioWildcard = require('socketio-wildcard')();
const zmq = require('zmq');
// eslint-disable-next-line import/no-extraneous-dependencies
const ports = require('@social/social-deployment/topology/portMaps'); // installed in parent folder

const subscriber = zmq.socket('sub');
subscriber.connect(`tcp://127.0.0.1:${ports.pubsub}`);
subscriber.subscribe('users.newUser');
subscriber.on('message', (topic, message) => {
    const t = topic.toString();
    let m;
    try {
        m = JSON.parse(message.toString());
    } catch (err) {
        m = message.toString();
    } finally {
        io.emit(t, m);
    }
});

const serverTimeout = 2000;
const serverErrorMsg = {
    status: 500,
    message: 'internal server error'
};
const serverTimeoutMsg = {
    status: 408,
    message: 'Server timed out for request'
};

function reqRes(ownerId, apiPath, action, command, args) {
    try {
        const apiPort = ports[apiPath].crud;
        const message = JSON.stringify({
            ownerId,
            action,
            command,
            args
        });
        const requester = zmq.socket('req');
        requester.connect(`tcp://127.0.0.1:${apiPort}`);

        let promise;
        let timer;

        requester.on('message', (msg) => {
            try {
                const m = JSON.parse(msg.toString());
                promise.resolve(m);
            } catch (err) {
                console.log(err);
                promise.reject();
            } finally {
                clearTimeout(timer);
                requester.close();
            }
        });
        return new Promise((resolve, reject) => {
            promise = { resolve, reject };
            timer = setTimeout(() => {
                requester.close();
                promise.resolve(serverTimeoutMsg);
            }, serverTimeout);
            requester.send(message);
        });
    } catch (err) {
        return Promise.reject(err);
    }
}

function checkAuth(user) {
    return Promise.resolve({
        valid: true,
        user
    });
}

function makeUserSocket(user, socket) {
    const { userId } = user;
    socket.on('*', (foo) => {
        let callBack;
        const apiPath = foo.data.shift();
        const action = foo.data.shift();
        const command = foo.data.shift();
        const args = foo.data.shift();
        if (typeof foo.data[foo.data.length - 1] === 'function') callBack = foo.data.pop();
        reqRes(userId, apiPath, action, command, args)
            .then((response) => {
                if (callBack) callBack(response);
            })
            .catch((err) => {
                console.log(err);
                if (callBack) {
                    callBack(serverErrorMsg);
                }
            });
    });
}
io.use(ioWildcard);
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', (reason) => {
        console.log('A user disconnected', reason);
    });
    socket.emit('getUser', (user) => {
        checkAuth(user)
            .then((userState) => {
                const loggedInUser = userState.user;
                if (!userState.valid) {
                    if (loggedInUser.userId !== null) socket.emit('loginError');
                    return;
                }
                makeUserSocket(loggedInUser, socket);
            })
            .catch((err) => {
                console.log(err);
                socket.emit('serverError', serverErrorMsg);
            });
    });
});

app.use('/img', proxy('localhost:3010'));
app.get('/socket.io/:fileName', (req, res) => {
    const { fileName } = req.params;
    res.sendFile(path.join(__dirname, 'node_modules/socket.io-client/dist', fileName));
});

http.listen(ports.bff.static, () => {
    console.log(`listening on *:${ports.bff.static}`);
});
