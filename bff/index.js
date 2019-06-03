// eslint-disable-next-line import/no-extraneous-dependencies
const ports = require('@social/social-deployment/topology/portMaps'); // installed in parent folder
const path = require('path');
const proxy = require('express-http-proxy');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { path: '/ws' });
const ioWildcard = require('socketio-wildcard')();
const Subscriber = require('./src/pubsub/Subscriber');
const makeUserSocket = require('./src/api/proxy');
const checkAuth = require('./src/auth/auth');

io.use(ioWildcard);
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', (reason) => {
        console.log('A user disconnected', reason);
    });
    socket.emit('getUser', (user) => {
        checkAuth(user)
            .then((loggedInUser) => {
                const subscriber = new Subscriber(socket);
                subscriber.subscribe('users.newUser');
                makeUserSocket(loggedInUser, socket);
            })
            .catch((err) => {
                socket.emit('loginError', err);
            });
    });
});

app.use('/img', proxy(`localhost:${ports.images.static}`));
app.get('/socket.io/:fileName', (req, res) => {
    const { fileName } = req.params;
    res.sendFile(path.join(__dirname, 'node_modules/socket.io-client/dist', fileName));
});

http.listen(ports.bff.static, () => {
    console.log(`listening on *:${ports.bff.static}`);
});
