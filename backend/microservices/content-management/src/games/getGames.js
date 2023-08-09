require('dotenv').config();
const { client } = require('../utils/dynamodb');
const { ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

module.exports.main = async event => {

    const scanCommand = new ScanCommand({
        TableName: process.env.DYNAMODB_GAMES_TABLE
    })
    try {
        const result = await client.send(scanCommand);
        const games = result.Items.map((item) => unmarshall(item));
        console.log(games);
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(games),
        };
    } catch (error) {
        console.error("Error getting games:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(error),
        };
    }
};
