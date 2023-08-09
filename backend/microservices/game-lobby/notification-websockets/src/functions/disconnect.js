require('dotenv').config();
const { dynamoDb } = require('../utils/dynamodb');

module.exports.main = async event => {
  return await dynamoDb
    .delete({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        "games": event.requestContext.connectionId,
      },
    })
    .promise();
};