require('dotenv').config();
const { client } = require('../utils/dynamodb');
const axios = require('axios');
const { PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const { isRequestValid } = require('../utils/questionValidation');
const crypto = require('crypto');


async function tagQuestion(question) {
    const url = process.env.TAGGING_API_URL;
    const body = question;
    const config = {
        headers: {
            'Content-Type': 'text/plain',
        },
    };
    try {
        const response = await axios.post(url, body, config);
        console.log('Response from tagging API: ', response);
        return response.data;
    } catch (error) {
        console.error('Error tagging question: ', error.message);
        throw new Error("Invalid question format.");
    }
}


async function createQuestion(questionData) {
    let tags = [];
    // try {
    //     let resp = await tagQuestion(questionData.question);
    //     tags = resp.split("/").filter((tag) => tag !== "");
    //     console.log('Tags: ', tags);
    // }
    // catch (error) {
    //     throw new Error("Invalid question format.");
    // }
    if (tags.length === 0) {
        tags = ["General", questionData.category];
    }
    const marshalledItem = marshall(questionData);
    const params = {
        TableName: process.env.DYNAMODB_QUESTIONS_TABLE,
        Item: marshalledItem,
    };

    try {
        console.log('Marshalled Item: ', marshalledItem);
        console.log('DynamoDB put parameters: ', params);
        await client.send(new PutItemCommand(params));

    } catch (error) {
        throw new Error("Error inserting question to table.");
    }
}

module.exports.main = async (event) => {
    const requestBody = JSON.parse(event.body);
    if (!isRequestValid(requestBody, "create")) {
        return {
            statusCode: 400,
            headers: {
                "Content-Type": "application/json",
            }, body: "Invalid request format."
        };
    }

    const questionId = crypto
        .createHash("md5")
        .update(JSON.stringify(requestBody))
        .digest("hex");

    const questionData = {
        ...requestBody,
        questionId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    try {
        await createQuestion(questionData);
        return {
            statusCode: 200,
            headers: {
                "content-Type": "application/json",
            }, body: JSON.stringify(questionData)
        };
    } catch (error) {
        console.error("Error in create Question procedure: ", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                "Content-Type": "application/json"
            }, body: JSON.stringify({ message: error.message })
        };
    }
};