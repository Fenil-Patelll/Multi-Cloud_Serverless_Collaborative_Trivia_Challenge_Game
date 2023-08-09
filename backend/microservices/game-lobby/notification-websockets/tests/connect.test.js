const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const { main } = require('../src/functions/connect');

describe('connect', () => {
    afterEach(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
    });

    it('should add connection to DynamoDB', async () => {
        const event = {
            requestContext: {
                connectionId: 'test'
            }
        };

        AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
            callback(null, {});
        });

        const result = await main(event);
        expect(result).toStrictEqual({});
    });

});