require("dotenv").config();
const { client } = require("../utils/dynamodb");
const { findQuestion } = require("../utils/findQuestion");
const { UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const { isRequestValid } = require("../utils/questionValidation");

async function editQuestion(questionId, updates) {
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};
  const updateExpressions = [];

  for (const key of Object.keys(updates)) {
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:${key}`] = updates[key];
    updateExpressions.push(`#${key} = :${key}`);
  }

  expressionAttributeValues[":updatedAt"] = new Date().toISOString();
  updateExpressions.push("updatedAt = :updatedAt");

  const updateParams = {
    TableName: process.env.DYNAMODB_QUESTIONS_TABLE,
    Key: marshall({ questionId }),
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: marshall(expressionAttributeValues),
  };

  try {
    await client.send(new UpdateItemCommand(updateParams));
  } catch (error) {
    console.error("Error editing question:", error);
    throw error;
  }
}

module.exports.main = async (event) => {
  const requestBody = JSON.parse(event.body);

  if (!isRequestValid(requestBody, "edit")) {
    return { statusCode: 400, body: "Invalid request format." };
  }

  const questionId = event.pathParameters.id;
  const existingQuestion = await findQuestion(questionId);

  if (existingQuestion) {
    try {
      await editQuestion(questionId, requestBody);
      return { statusCode: 200, body: JSON.stringify(requestBody) };
    } catch (error) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }, body: JSON.stringify(error)
      };
    }
  } else {
    return {
      statusCode: 404,
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: `Question with ID ${questionId} not found.`,
    };
  }
};