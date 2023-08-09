const { client } = require("./dynamodb");
const { GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

async function findQuestion(questionId) {
    const params = {
        TableName: process.env.DYNAMODB_QUESTIONS_TABLE,
        Key: marshall({ questionId }),
    };

    try {
        const response = await client.send(new GetItemCommand(params));
        return response.Item ? unmarshall(response.Item) : null;
    } catch (error) {
        console.error(`Error fetching question with ID ${questionId}:`, error);
        return null;
    }
}

module.exports = { findQuestion };