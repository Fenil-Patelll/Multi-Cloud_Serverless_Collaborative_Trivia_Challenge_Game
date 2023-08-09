const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const { main } = require('../src/functions/disconnect');

describe('disconnect', () => {
    afterEach(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
    });

    it('should remove the connection from DynamoDB', async () => {
        const event = {
            requestContext: {
                connectionId: 'test'
            }
        };

        AWSMock.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
            callback(null, {});
        });

        const result = await main(event);
        expect(result).toStrictEqual({});
    });

});