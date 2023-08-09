require('dotenv').config();
const { client } = require('../utils/dynamodb');
const { findGame } = require('../utils/findGame');
const { DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

async function deleteGame(gameId) {
    const params = {
        TableName: process.env.DYNAMODB_GAMES_TABLE,
        Key: marshall({ gameId }),
    };

    try {
        await client.send(new DeleteItemCommand(params));
    } catch (error) {
        console.error("Error deleting game:", error);
        throw error;
    }
}

module.exports.main = async (event) => {
    const gameId = event.pathParameters.id;
    const existingGame = await findGame(gameId);

    if (existingGame) {
        try {
            await deleteGame(gameId);
            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                }, body: `Game with ID ${gameId} deleted.`
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
            },
            body: `Game with ID ${gameId} not found.`,
        };
    }
};