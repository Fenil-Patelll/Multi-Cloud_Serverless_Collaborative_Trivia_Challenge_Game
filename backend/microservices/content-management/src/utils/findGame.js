const { client } = require("./dynamodb");
const { GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

async function findGame(gameId) {
    const params = {
        TableName: process.env.DYNAMODB_GAMES_TABLE,
        Key: marshall({ gameId }),
    };

    try {
        const response = await client.send(new GetItemCommand(params));
        return response.Item ? unmarshall(response.Item) : null;
    } catch (error) {
        console.error(`Error fetching game with ID ${gameId}:`, error);
        return null;
    }
}

module.exports = { findGame };