const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log(event);
    const { httpMethod, queryStringParameters } = event;
    const userId = queryStringParameters ? queryStringParameters.userId : null;
    const type = queryStringParameters ? queryStringParameters.notificationType : null;
    let response;
    console.log(typeof userId)
    console.log("printing httpMethod and event")
    console.log(event);
    console.log(httpMethod);
    try {
        console.log("in fetchingt lambda")
        if (httpMethod === 'GET') {
            if (userId) {
                // Get notifications by user ID

                response = await getNotificationsByUserId(userId);
            } else if (type) {
                // Get notifications by notification type

                response = await getNotificationsByNotificationType(type);
            } else {
                // Invalid query parameters
                return {
                    statusCode: 400,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({ message: 'Bad Request' }),
                };
            }
        } else {
            // Invalid HTTP method
            return {
                statusCode: 405,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ message: 'Method Not Allowed' }),
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(response),
        };
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};

async function getNotificationsByUserId(userId) {
    try {
        console.log("in noti by user id");

        if (!userId) {
            throw new Error('Missing "userId" parameter');
        }

        const params = {
            TableName: 'NotificationAlert',
            FilterExpression: 'userId = :userId AND readStatus = :readStatus',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':readStatus': false
            },
        };

        const result = await dynamodb.scan(params).promise();
        return result.Items;
    } catch (error) {
        console.error('Error fetching notifications by user ID:', error);
        throw error;
    }
}


async function getNotificationsByNotificationType(type) {
    try {
        console.log("noti by noti type");
        console.log(type);
        if (!type) {
            throw new Error('Missing "type" parameter');
        }

        const params = {
            TableName: 'NotificationAlert',
            FilterExpression: '#notificationTypeAlias = :type AND readStatus = :readStatus', // Use an alias for the reserved attribute name
            ExpressionAttributeNames: {
                '#notificationTypeAlias': 'type', // Define the alias for the attribute name
            },
            ExpressionAttributeValues: {
                ':type': type,
                ':readStatus':false
            },
        };

        const result = await dynamodb.scan(params).promise();
        console.log("Getting notification type result")
        console.log(result);
        return result.Items;
    } catch (error) {
        console.error('Error fetching notifications by notification type:', error);
        throw error;
    }
}
