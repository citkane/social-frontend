/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */

const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';
const { MessageConsumerPact, synchronousBodyHandler, Matchers } = require('@pact-foundation/pact');
const path = require('path');
const chai = require('chai');
const dateString = require('chai-date-string');
const fs = require('fs-extra');
const config = require('config');
const axios = require('axios');
const mlog = require('mocha-logger');

const { eachLike, term, like } = Matchers;
const { expect } = chai;
chai.use(dateString);
const pactsDir = path.join(__dirname, '../pacts');
const pacts = config.get('pacts');
const pactBrokerUrl = `${pacts.broker}:${pacts.brokerPort}`;
const network = config.get('network');

const deletedPacts = [];
function makeMessagePact(provider) {
    if (deletedPacts.indexOf(provider) < 0) {
        fs.removeSync(path.join(pactsDir, `social-frontend-bff-${provider}.json`));
        deletedPacts.push(provider);
    }

    return new MessageConsumerPact({
        consumer: 'social-frontend-bff',
        provider,
        dir: pactsDir,
        logLevel: LOG_LEVEL,
        spec: 2
    });
}
describe('bff consumer', () => {
    let frontendMessages;
    before(async () => {
        const reqPath = `${pactBrokerUrl}/pacts/provider/social-frontend-bff/consumer/social-frontend/latest`;
        try {
            frontendMessages = await axios.get(reqPath);
            frontendMessages = frontendMessages.data.messages;
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    });
    describe('ENVIRONMENT', () => {
        it('is running in test environment', () => {
            expect(process.env.NODE_ENV).to.equal('test');
        });
    });
    describe('reads subscriptions from each service', () => {
        it('read.bffSubscriptions', () => {
            function handler(response) {
                expect(response.status).to.equal(200);
                expect(response.payload).to.be.an('array');
            }
            Object.keys(network).forEach((service) => {
                if (service === 'bff' || service === 'persistance') return;
                if (!network[service].publish || !network[service].crud) return;
                mlog.log(service);
                const messagePact = makeMessagePact(network[service].name);
                const expectedResponse = {
                    status: 200,
                    payload: eachLike('a string')
                };
                messagePact
                    .expectsToReceive(`${service}.read.bffSubscriptions`)
                    .withContent(expectedResponse)
                    .withMetadata({ 'content-type': 'application/json' })
                    .verify(synchronousBodyHandler(handler));
            });
        });
    });
    describe('proxies frontend api calls to backend services', () => {
        it('creates the contracts', () => {
            frontendMessages.forEach(async (message) => {
                
                const request = message.providerStates[0].name;
                const provider = network[request.type].name;
                const newRequest = {
                    ownerId: 'testbffuser',
                    action: request.action,
                    command: request.command,
                    args: request.args
                };
                const messagePact = makeMessagePact(provider);
                await messagePact
                    .expectsToReceive(message.description)
                    .given(newRequest)
                    .withContent(message.contents)
                    .withMetadata({ 'content-type': 'application/json' })
                    .verify(() => {});

                const pactFile = `${pactsDir}/social-frontend-bff-${provider}.json`;
                const pact = fs.readJsonSync(pactFile);
                const pMessage = pact.messages.find(m => m.description === message.description);
                pMessage.matchingRules = message.matchingRules;
                fs.writeJsonSync(pactFile, pact);
            });
        });
    });
});
