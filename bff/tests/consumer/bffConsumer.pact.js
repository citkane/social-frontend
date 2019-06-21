/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */

const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';
const { MessageConsumerPact, synchronousBodyHandler, Matchers } = require('@pact-foundation/pact');
const path = require('path');
const chai = require('chai');
const dateString = require('chai-date-string');
const config = require('config');

const { like } = Matchers;
const { expect } = chai;
chai.use(dateString);
const pactsDir = path.join(__dirname, '../pacts');
function makeMessagePact(provider) {
    return new MessageConsumerPact({
        consumer: 'social-frontend-bff',
        provider,
        pactfileWriteMode: 'update',
        dir: pactsDir,
        logLevel: LOG_LEVEL,
        spec: 2
    });
}
describe('bff consumer', () => {
    it('creates contract to read subscriptions for each service', () => {
        const network = config.get('network');
        function handler(response) {
            expect(response.status).to.equal(200);
            expect(response.payload).to.be.an('array');
        }
        Object.keys(network).forEach((service) => {
            if (service === 'bff' || !network[service].publish || !network[service].crud) return;
            const messagePact = makeMessagePact(network[service].name);
            const expectedResponse = {
                status: 200,
                payload: like([])
            };
            messagePact
                .expectsToReceive(`${service}.read.bffSubscriptions`)
                .withContent(expectedResponse)
                .withMetadata({ 'content-type': 'application/json' })
                .verify(synchronousBodyHandler(handler));
        });
    });
});
