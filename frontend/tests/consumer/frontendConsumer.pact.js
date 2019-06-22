/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */

const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';
const { MessageConsumerPact, Matchers } = require('@pact-foundation/pact');
const path = require('path');
const fs = require('fs-extra');
const { api } = require('../utils');

const { like, iso8601DateTimeWithMillis, iso8601Date } = Matchers;
const pactsDir = path.join(__dirname, '../pacts');

const deletedPacts = [];
function makeMessagePact(provider) {
    if (deletedPacts.indexOf(provider) < 0) {
        fs.removeSync(path.join(pactsDir, `social-frontend-${provider}.json`));
        deletedPacts.push(provider);
    }

    return new MessageConsumerPact({
        consumer: 'social-frontend',
        provider,
        dir: pactsDir,
        logLevel: LOG_LEVEL,
        spec: 2
    });
}
describe('fontend gui consumer', () => {
    describe('CRUD create', () => {
        it('create.user', () => {
            const request = api.create('users.user', {
                userName: 'testuser',
                realName: 'Test User',
                about: 'About the user'
            });
            const expectedResponse = {
                status: 201,
                payload: {
                    userName: 'testuser',
                    realName: 'Test User',
                    about: 'About the user',
                    uid: like('sf7ufjx7hb5b6'),
                    created: iso8601DateTimeWithMillis('2019-06-22T22:11:49.347Z')
                }
            };
            const messagePact = makeMessagePact('social-frontend-bff');
            return messagePact
                .expectsToReceive('users.create.user')
                .given(request)
                .withContent(expectedResponse)
                .withMetadata({ 'content-type': 'application/json' })
                .verify(() => {});
        });

        it('create.activity', () => {
            const request = api.create('activities.activity', {
                title: 'Test Activity',
                about: 'About the activity',
                date: '2019-06-28'
            });
            const expectedResponse = {
                status: 201,
                payload: {
                    title: 'Test Activity',
                    about: 'About the activity',
                    date: iso8601Date('2016-01-01'),
                    ownerId: like('sf7ufjx7hb5b6'),
                    uid: like('sf7ufjx7hb5b6'),
                    created: iso8601DateTimeWithMillis('2019-06-22T22:11:49.347Z')
                }
            };
            const messagePact = makeMessagePact('social-frontend-bff');
            return messagePact
                .expectsToReceive('activities.create.activity')
                .given(request)
                .withContent(expectedResponse)
                .withMetadata({ 'content-type': 'application/json' })
                .verify(() => {});
        });
    });
});
