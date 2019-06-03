/* eslint-disable class-methods-use-this */
// eslint-disable-next-line import/no-extraneous-dependencies
const ports = require('@social/social-deployment/topology/portMaps'); // installed in parent folder
const zmq = require('zmq');

const subscriber = zmq.socket('sub');
subscriber.connect(`tcp://127.0.0.1:${ports.pubsub}`);
const subscriptions = [];

class Subscriber {
    constructor(socket) {
        this.socket = socket;
        this.subscriber = subscriber;
        this.topics = [];
        subscriber.on('message', (topic, message) => {
            const t = topic.toString();
            if (this.topics.indexOf(t) < 0) return;
            let m;
            try {
                m = JSON.parse(message.toString());
            } catch (err) {
                m = message.toString();
            } finally {
                socket.emit(t, m);
            }
        });
    }

    subscribe(topic) {
        if (subscriptions.indexOf(topic) < 0) {
            subscriptions.push(topic);
            subscriber.subscribe(topic);
        }
        if (this.topics.indexOf(topic) < 0) this.topics.push(topic);
    }

    unsubscribe(topic) {
        // subscriber.unsubscribe(topic);
    }
}

module.exports = Subscriber;
