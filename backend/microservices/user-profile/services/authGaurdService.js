const AWS = require("aws-sdk");

const cognito = new AWS.CognitoIdentityServiceProvider();

exports.verifyToken = async (params) => {
  return cognito.getUser(params).promise();
};
