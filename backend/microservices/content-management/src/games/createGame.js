require('dotenv').config();
const { client } = require('../utils/dynamodb');
const { findGame } = require('../utils/findGame');
const { isRequestValid } = require('../utils/gameValidation');
const { PutItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const axios = require('axios');
const crypto = require('crypto');

async function createGame(gameData) {
    const marshalledItem = marshall(gameData);

    const params = {
        TableName: process.env.DYNAMODB_GAMES_TABLE,
        Item: marshalledItem,
    };

    try {
        await client.send(new PutItemCommand(params));
    } catch (error) {
        console.error("Error creating a new game:", error);
        throw error;
    }
}

async function notifyClients(gameData) {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
        },
        maxBodyLength: Infinity,
    };

    let url = process.env.NOTIFY_USERS_ENDPOINT;
    await axios.post(url, JSON.stringify(gameData), axiosConfig);
}

async function updateGameStatus(gameId) {
    const updateParams = {
        TableName: process.env.DYNAMODB_GAMES_TABLE,
        Key: marshall({ gameId }),
        UpdateExpression: "SET #status = :true",
        ExpressionAttributeNames: {
            "#status": "status",
        },
        ExpressionAttributeValues: marshall({
            ":true": true,
        }),
    };

    try {
        await client.send(new UpdateItemCommand(updateParams));
    } catch (error) {
        console.error("Error updating game status:", error);
        throw error;
    }
}

module.exports.main = async (event) => {
    const requestBody = JSON.parse(event.body);

    if (!isRequestValid(requestBody, "create")) {
        return { statusCode: 400, body: "Invalid request format." };
    }

    const gameId = crypto
        .createHash("md5")
        .update(JSON.stringify(requestBody))
        .digest("hex");

    const existingGame = await findGame(gameId);

    if (existingGame) {
        if (existingGame.status) {
            return { statusCode: 200, body: JSON.stringify({ "message": "Game already exists and is active" }) };
        } else {
            try {
                await updateGameStatus(gameId);
                await notifyClients(existingGame);
                return { statusCode: 200, body: JSON.stringify({"message": "Game created !"}) };
            } catch (error) {
                return { statusCode: 500, body: JSON.stringify(error) };
            }
        }
    } else {
        const gameData = {
            ...requestBody,
            gameId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        try {
            await createGame(gameData);
            await notifyClients(gameData);
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
    }
};