const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { httpMethod, body } = event;
    const { notificationIds } = JSON.parse(body);
    console.log("printing event logs");
    console.log(event)
    let response;

    try {
        if (httpMethod === 'PUT') {

            // Loop through the notificationIds array and call markNotificationAsRead for each notificationId
            for (const notificationId of notificationIds) {
                let type = notificationId.split('_')[0];
                console.log(type)
                await markNotificationAsRead(notificationId,type);
            }

            response = { message: 'Notifications marked as read successfully' };
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
        console.error('Error marking notification as read:', error);
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

async function markNotificationAsRead(notificationId,type) {
    try {
        // Update the ReadStatus field of the notification in DynamoDB
        // Implement your code here
        // Example:
        console.log("printing type");

        const params = {
            TableName: 'NotificationAlert',
            Key: {
                type: type,
                notificationId: notificationId,
            },
            UpdateExpression: 'SET readStatus = :readStatus',
            ExpressionAttributeValues: {
                ':readStatus': true,
            },
        };

        await dynamodb.update(params).promise();
        return { message: 'Notification marked as read successfully' };
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
}
