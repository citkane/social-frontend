const config = require('config');

// eslint-disable-next-line no-underscore-dangle
global.__network = config.get('network');

const path = require('path');
const proxy = require('express-http-proxy');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { path: '/ws' });

const Subscriber = require('./pubsub/Subscriber');
const { makeUserSocket, reqRes, checkStatus } = require('./api/proxy');

const subscriber = new Subscriber();
subscriber.subscribe('users.user-updated');
subscriber.subscribe('users.user-created');
subscriber.subscribe('users.user-deleted');

function makeSocket(user) {
    if (io.nsps[`/${user.uid}`]) return;
    const nsp = io.of(`/${user.uid}`);
    nsp.on('connection', (socket) => {
        console.log(`${user.userName} connected`);
        subscriber.add(socket);
        socket.on('disconnect', () => {
            console.log(`${user.userName} disconnected`);
            subscriber.prune(socket);
        });
        makeUserSocket(user, socket);
    });
}
app.use('/img', proxy(`${__network.images.host}:${__network.images.static}`));

app.get('/socket.io/:fileName', (req, res) => {
    const { fileName } = req.params;
    res.sendFile(path.join(__dirname, '../node_modules/socket.io-client/dist', fileName));
});

app.get('/login', (req, res) => {
    const { userName, password } = req.query;
    reqRes('admin', 'users', 'read', 'userByName', [userName])
        .then((data) => {
            const err = checkStatus(data).error;
            if (!err) {
                const user = data.payload;
                makeSocket(user);
                res.send(user);
            } else {
                res.status(err.status).send(err.message);
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err.message);
        });
});

http.listen(__network.bff.static, __network.bff.host, () => {
    console.log(`listening on http://${__network.bff.host}:${__network.bff.static}`);
});