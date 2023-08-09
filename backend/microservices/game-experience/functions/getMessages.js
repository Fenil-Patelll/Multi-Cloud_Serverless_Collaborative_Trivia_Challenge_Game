// Import AWS SDK
const AWS = require('aws-sdk');

// Instantiate SQS client
const sqs = new AWS.SQS({ region: process.env.region });

// Import chat model
const Chat = require("../models/chat.model");

// Function to get the SQS queue URL
const getQueueUrl = async () => {
    const params = {
        QueueName: 'ChatQueue' // Name of the queue
    };
    return new Promise((resolve, reject) => {
        // Make the request to get the queue URL
        sqs.getQueueUrl(params, function (err, data) {
            if (err) {
                // Log any error
                console.log(err, err.stack);
                reject(err);
            }
            else {
                // Log the queue URL
                console.log(data.QueueUrl);
                // Resolve the promise with the queue URL
                resolve(data.QueueUrl);
            }
        });
    });
}

// Function to get the messages from the SQS queue
exports.getMessages = async (event, context) => {
    let queueUrl;
    let response;

    // Try to get the queue URL
    try {
        queueUrl = await getQueueUrl();
    } catch (err) {
        console.error('Could not fetch Queue URL: ', err);
        // Set the response as an internal server error
        response = {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error. Failed to fetch SQS Queue URL!' })
        };
        return response;
    }

    const params = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10, // Get up to 10 messages at a time
        WaitTimeSeconds: 20 // Wait up to 20 seconds for a message
    };

    try {
        // Receive the messages from the queue
        const data = await sqs.receiveMessage(params).promise();

        // If there are no new messages, return a 204 status code
        if (!data.Messages) {
            response = {
                statusCode: 204,
                body: JSON.stringify({ message: 'No new messages' })
            };
            return response;
        }

        // Parse the received messages
        const messages = data.Messages.map(msg => {
            const messageBody = JSON.parse(msg.Body);
            return JSON.parse(messageBody.Message);
        });

        // Save chat messages to DynamoDB
        for (const message of messages) {
            const chat = new Chat({
                chatId: message.chatId,
                teamId: message.teamId,
                senderId: message.senderId,
                senderName: message.senderName,
                message: message.message,
                timestamp: message.timestamp || Date.now()
            });
            await chat.save(); // Save each chat message
        }

        // Delete the messages from the queue after reading
        const deleteParams = {
            QueueUrl: params.QueueUrl,
            Entries: data.Messages.map((msg, idx) => ({
                Id: idx.toString(),
                ReceiptHandle: msg.ReceiptHandle
            }))
        };

        await sqs.deleteMessageBatch(deleteParams).promise();

        const { teamId } = event.pathParameters; // Extract teamId from the event
        console.log(teamId);
        const teamMessages = await getMessagesByTeamId(teamId); // Get messages for the specific team
        console.log(teamMessages);
        response = {
            statusCode: 200,
            body: JSON.stringify({ teamMessages })
        };
        return response;

    } catch (err) {
        console.error(err);
        // Set the response as an internal server error
        response = {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not fetch messages' })
        };
        return response;
    }
};

// Function to get messages by team ID from DynamoDB
const getMessagesByTeamId = async (teamId) => {
    const messages = await Chat.scan('teamId').eq(teamId).exec(); // Scan for messages with the team ID
    const sortedMessages = messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Sort the messages by timestamp
    return sortedMessages; // Return the sorted messages
};
