const dynamoose = require("dynamoose");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
require("dotenv").config();

// Initialize a DynamoDB client instance
const dynamodb = new DynamoDB({
  region: process.env.region,
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    sessionToken: process.env.sessionToken
  }
});


dynamoose.aws.sdk = dynamodb;

// Define a schema for chat messages
const chatSchema = new dynamoose.Schema({
  chatId: { type: String, hashKey: true, required: true, index: true }, // The primary key of the Chat table
  teamId: { type: String, required: true }, // The team where the chat message was sent
  senderId: { type: String, required: true }, // The sender of the chat message
  senderName: { type: String, required: true },
  message: { type: String, required: true }, // The chat message
  timestamp: { type: Date, default: Date.now }, // The time the message was sent
});


// Create a Chat model using the schema
const Chat = dynamoose.model("Chat", chatSchema);

module.exports = Chat;



