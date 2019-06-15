/* eslint-disable class-methods-use-this */
const zmq = require('zmq');
const config = require('config');

const network = config.get('network');
const subscriber = zmq.socket('sub');
subscriber.connect(`tcp://${network.pubsub.host}:${network.pubsub.port}`);
console.log('subscriber: ', `tcp://${network.pubsub.host}:${network.pubsub.port}`);

let sockets = [];
let topics = [];

subscriber.on('message', (topic, message) => {
    const t = topic.toString();
    if (topics.indexOf(t) < 0) return;
    let m;
    try {
        m = JSON.parse(message.toString());
    } catch (err) {
        m = message.toString();
    } finally {
        sockets.forEach((socket) => {
            socket.emit(t, m);
        });
    }
});

class Subscriber {
    add(socket) {
        if (!sockets.find(s => s.id === socket.id)) sockets.push(socket);
    }

    prune(socket) {
        sockets = sockets.filter(s => s.id !== socket.id);
        console.log(sockets.length);
    }

    subscribe(topic) {
        if (topics.indexOf(topic) === -1) {
            topics.push(topic);
            subscriber.subscribe(topic);
        }
    }

    unsubscribe(topic) {
        topics = topics.filter(t => t !== topic);
        subscriber.unsubscribe(topic);
    }
}

module.exports = Subscriber;
