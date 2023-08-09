const { ApiGatewayManagementApi } = require('aws-sdk');
const { dynamoDb } = require('./dynamodb');
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

async function sendMessageToAllConnections(connections, messageData) {
  const apiGateway = new ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: `https://${process.env.WEBSOCKETS_API_URL}`,
  });

  const tasks = connections.map(async (connection) => {
    try {
      await apiGateway
        .postToConnection({
          ConnectionId: connection,
          Data: JSON.stringify(messageData),
        })
        .promise();
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  return Promise.all(tasks);
}

async function getAllActiveConnections() {
  const dynamoDb = new DynamoDBClient({ region: "us-east-1", });

  const scanCommand = new ScanCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    ProjectionExpression: 'games',
  });

  const currentConnections = await dynamoDb.send(scanCommand);
  const connections = currentConnections?.Items.map(({ games }) => games.S) || [];
  return connections;
}

module.exports = {
  sendMessageToAllConnections,
  getAllActiveConnections,
};