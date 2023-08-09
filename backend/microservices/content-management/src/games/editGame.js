require("dotenv").config();
const { client } = require("../utils/dynamodb");
const { findGame } = require("../utils/findGame");
const { UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const { isRequestValid } = require("../utils/gameValidation");

async function editGame(gameId, updates) {
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
        TableName: process.env.DYNAMODB_GAMES_TABLE,
        Key: marshall({ gameId }),
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: marshall(expressionAttributeValues),
    };

    try {
        await client.send(new UpdateItemCommand(updateParams));
    } catch (error) {
        console.error("Error editing game:", error);
        throw error;
    }
}

module.exports.main = async (event) => {
    const requestBody = JSON.parse(event.body);

    if (!isRequestValid(requestBody, "edit")) {
        return { statusCode: 400, body: "Invalid request format." };
    }

    const gameId = event.pathParameters.id;
    const existingGame = await findGame(gameId);

    if (existingGame) {
        try {
            await editGame(gameId, requestBody);
            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                }, body: JSON.stringify(requestBody)
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
            }, body: `Game with ID ${gameId} not found.`,
        };
    }
};