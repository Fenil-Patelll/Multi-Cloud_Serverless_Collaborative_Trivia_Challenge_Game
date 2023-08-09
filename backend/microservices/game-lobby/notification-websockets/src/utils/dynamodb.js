const { DynamoDB } = require('aws-sdk');
const dynamoDb = new DynamoDB.DocumentClient({ region: "us-east-1" });

module.exports = {
  dynamoDb
};