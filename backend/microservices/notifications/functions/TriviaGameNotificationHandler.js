const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {

        console.log(event)
        const records = event.Records;

        for (const record of records) {
            console.log(record)
            const message = JSON.parse(record.body);
            console.log('In lambda...');
            console.log('Received message:', message);
            const m = JSON.parse(message.Message);
            // Store the message in DynamoDB
            await saveNotificationToDynamoDB(m);

        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: 'Processed messages successfully' }),
        };
    } catch (error) {
        console.error('Error processing messages:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};

async function saveNotificationToDynamoDB(notification) {
    console.log("printing the notificaion")
    console.log(typeof notification)
    const notificationId = `${notification.type}_${Date.now()}`;
    console.log(notificationId)
    const params = {
        TableName: 'NotificationAlert',
        Item: {
            notificationId: notificationId,
            readStatus: false,
            ...notification,
        }
    };
    console.log(params)
    await dynamoDB.put(params).promise();
}
