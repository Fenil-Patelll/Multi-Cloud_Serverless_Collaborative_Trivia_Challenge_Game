const { client } = require("./dynamodb");
const { QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

async function findQuestionByCategory(category) {
    const params = {
        TableName: process.env.DYNAMODB_QUESTIONS_TABLE,
        IndexName: "CategoryIndex",
        KeyConditionExpression: 'category = :category',
        ExpressionAttributeValues: {
            ":category": { S: category }
        },
    };

    try {
        const response = await client.send(new QueryCommand(params));
        const items = response.Items;
        return items.map(item => unmarshall(item));
    } catch (error) {
        console.error(`Error fetching questions with category ${category}:`, error);
        return null;
    }
}

module.exports = { findQuestionByCategory };
