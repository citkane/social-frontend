const config = require('config');
const path = require('path');
const express = require('express');
const proxy = require('express-http-proxy');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { path: '/ws' });
const Subscriber = require('./pubsub/Subscriber');
const { makeUserSocket, reqRes, checkStatus } = require('./api/proxy');

/** Communicate all backend subscriptions to be passed to frontend */
const network = config.get('network');
const subscriber = new Subscriber();
subscriber.subscribe('bff/makesubscriptions');
Object.keys(network).forEach((service) => {
    if (service === 'bff' || service === 'persistance') return;
    if (!network[service].publish || !network[service].crud) return;
    reqRes(null, service, 'read', 'bffSubscriptions', [])
        .then((response) => {
            if (response.status !== 200) return;
            response.payload.forEach((topic) => {
                if (topic) subscriber.subscribe(topic);
            });
        })
        .catch(err => err);
});
/** Create a websocket for authenticated frontend session */
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

/** proxy static assets to microservices */
// app.use('/img', proxy(`${network.images.host}:${network.images.static}`));
// const pacts = config.get('pacts');
// const pactProxy = `${pacts.broker}:${pacts.brokerPort}`;
// app.use('/pact', proxy(pactProxy));
const publicDir = path.join(__dirname, '../../frontend/dist');
const docDir = path.join(__dirname, '../../../docs');
app.use(express.static(publicDir));
app.use('/docs', express.static(docDir));
/** Serve the static socket.io code to the client */
app.get('/socket.io/:fileName', (req, res) => {
    const { fileName } = req.params;
    res.sendFile(path.join(__dirname, '../node_modules/socket.io-client/dist', fileName));
});

/** Do session authentication queries */
app.get('/login', (req, res) => {
    const { userName, password } = req.query;
    reqRes('admin', 'users', 'read', 'userByName', [userName])
        .then((data) => {
            console.log(data);
            const err = checkStatus(data).error;
            console.log(err);
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

const connectionUrl = `http://${network.bff.host}:${network.bff.static}`;
http.listen(network.bff.static, network.bff.host, () => {
    console.log(`listening on ${connectionUrl}`);
});

function gracefulShutdown() {
    console.log('Gracefully shutting down social-frontend-bff');
    process.exit();
}

module.exports = {
    makeSocket,
    gracefulShutdown,
    connectionUrl
};
