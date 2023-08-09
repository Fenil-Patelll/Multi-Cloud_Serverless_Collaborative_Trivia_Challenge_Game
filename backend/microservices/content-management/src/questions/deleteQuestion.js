require('dotenv').config();
const { client } = require('../utils/dynamodb');
const { findQuestion } = require('../utils/findQuestion');
const { DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

async function deleteQuestion(questionId) {
    const params = {
        TableName: process.env.DYNAMODB_QUESTIONS_TABLE,
        Key: marshall({ questionId }),
    };

    try {
        await client.send(new DeleteItemCommand(params));
    } catch (error) {
        console.error("Error deleting question:", error);
        throw error;
    }
}

module.exports.main = async (event) => {
    const questionId = event.pathParameters.id;
    const existingQuestion = await findQuestion(questionId);

    if (existingQuestion) {
        try {
            await deleteQuestion(questionId);
            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                }, body: `Question with ID ${questionId} deleted.`
            };
        } catch (error) {
            return {
                statusCode: 500,
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
            }, body: `Question with ID ${questionId} not found.`,
        };
    }
};