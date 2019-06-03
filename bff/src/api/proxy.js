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
                console.log(msg.toString());
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

module.exports = makeUserSocket;
