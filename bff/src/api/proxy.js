const zmq = require('zmq');
const config = require('config');

const network = config.get('network');
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
        const message = JSON.stringify({
            ownerId,
            action,
            command,
            args
        });
        const requester = zmq.socket('req');
        requester.connect(`tcp://${network[apiPath].host}:${network[apiPath].crud}`);

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
        if (!packet.length) return;
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
