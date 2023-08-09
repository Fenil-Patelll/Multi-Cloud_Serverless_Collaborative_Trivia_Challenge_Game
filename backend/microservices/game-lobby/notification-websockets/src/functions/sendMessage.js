require('dotenv').config();
const { getAllActiveConnections, sendMessageToAllConnections } = require('../utils/websocketService');
const { DynamoDBClient, DeleteCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { publishToPubSub } = require('../utils/pubsub');

const client = new DynamoDBClient({ region: "us-east-1", });
const docClient = DynamoDBDocumentClient.from(client);

module.exports.main = async event => {
  // Retrieve the list of active WebSocket connections
  const currentConnections = await getAllActiveConnections();

  // Send a custom message to each connection
  const messageData = {
    data: "HELLO",
  };
  await sendMessageToAllConnections(currentConnections, messageData);

  // Handle stale connections
  for (const connectionId of currentConnections) {
    try {
      // Send a message (Already done above)
    } catch (error) {
      if (error.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        const deleteCommand = new DeleteCommand({
          TableName: process.env.DYNAMODB_TABLE_NAME,
          Key: {
            games: connectionId,
          },
        });
        const response = await docClient.send(deleteCommand);
        console.log(response);
      } else {
        throw error;
      }
    }
  }

};