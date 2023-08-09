require('dotenv').config();
const { client } = require('../utils/dynamodb');
const { ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

module.exports.main = async event => {

    const scanCommand = new ScanCommand({
        TableName: process.env.DYNAMODB_QUESTIONS_TABLE
    })
    try {
        const result = await client.send(scanCommand);
        const questions = result.Items.map((item) => unmarshall(item));
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(questions),
        };
    } catch (error) {
        console.error("Error getting questions:", error);
        return {
            statusCode: 500,
            body: JSON.stringify(error),
        };
    }
};