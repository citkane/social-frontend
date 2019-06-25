/* eslint-disable import/no-extraneous-dependencies */
const { MessageProviderPact } = require('@pact-foundation/pact');
const config = require('config');
const { expect } = require('chai');
const axios = require('axios');
const zmq = require('zeromq');
const io = require('socket.io-client');
const {
    makeSocket,
    gracefulShutdown,
    connectionUrl
} = require('../../src/bff');
const { version } = require('../../package.json');

const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';
const pacts = config.get('pacts');
const pactBrokerUrl = `http://${pacts.host}:${pacts.port}`;
const network = config.get('network');

function makePact(messageProviders) {
    return new MessageProviderPact({
        messageProviders,
        logLevel: LOG_LEVEL,
        provider: 'social-frontend-bff',
        providerVersion: version,
        pactBrokerUrl,
        publishVerificationResult: true
    });
}


describe('bff consumer expectations', () => {
    const messageProviders = {};
    let frontendMessages;
    let socket;
    const testUserId = 'testuserbff';
    const testUser = { uid: testUserId, userName: 'testuser' };
    makeSocket(testUser);
    before(async () => {
        const reqPath = `${pactBrokerUrl}/pacts/provider/social-frontend-bff/consumer/social-frontend/latest`;
        try {
            frontendMessages = await axios.get(reqPath);
            frontendMessages = frontendMessages.data.messages;
            socket = io(`${connectionUrl}/${testUserId}`, { path: '/ws' });
            return new Promise((resolve) => {
                socket.on('connect', () => { resolve(); });
            });
        } catch (err) {
            return Promise.reject(err);
        }
    });
    after(() => {
        setTimeout(() => { gracefulShutdown(); }, 1000);
    });

    describe('ENVIRONMENT', () => {
        it('is running in test environment', () => {
            expect(process.env.NODE_ENV).to.equal('test');
        });
    });
    describe('it responds to proxy requests from the frontend gui', () => {
        it('descibes each frontend requirement', () => {
            const promises = [];
            frontendMessages.forEach((message) => {
                const request = message.providerStates[0].name;
                const args = [request.type, request.action, request.command, request.args];
                promises.push(new Promise(async (resolve) => {
                    const contractWith = network[request.type].name;
                    const reqPath = `${pactBrokerUrl}/pacts/provider/${contractWith}/consumer/social-frontend-bff/latest`;
                    let mess = await axios.get(reqPath);
                    mess = mess.data.messages;
                    const response = mess.find(m => m.description === message.description).contents;
                    const responder = zmq.socket('router');
                    responder.bindSync(`tcp://${network[request.type].host}:${network[request.type].crud}`);
                    responder.on('message', (...m) => {
                        responder.send([m[0], '', JSON.stringify(response)]);
                    });
                    socket.emit(...args, (res) => {
                        messageProviders[message.description] = () => res;
                        responder.close();
                        resolve();
                    });
                }));
            });
            return Promise.all(promises);
        });
    });
    describe('fulfill all contract requirements', () => {
        it('verify against broker', () => makePact(messageProviders).verify());
    });
});
