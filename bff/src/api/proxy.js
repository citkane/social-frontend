// eslint-disable-next-line import/no-extraneous-dependencies
const ports = require('@social/social-deployment/topology/portMaps'); // installed in parent folder
const zmq = require('zmq');


const serverTimeout = 2000;
const serverErrorMsg = {
    status: 500,
    message: 'internal server error'
};
const serverTimeoutMsg = {
    status: 408,
    message: 'Server timed out for request'
};

function checkStatus(data) {
    if (data.status > 199 && data.status < 300) return data;
    return { error: data };
}

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

function makeUserSocket(user, socket) {
    const { userId } = user;
    socket.use((packet, next) => {
        let callBack;
        const apiPath = packet.shift();
        const action = packet.shift();
        const command = packet.shift();
        const args = packet.shift();
        if (typeof packet[packet.length - 1] === 'function') callBack = packet.pop();
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
        next();
    });
}

module.exports = { makeUserSocket, reqRes, checkStatus };
