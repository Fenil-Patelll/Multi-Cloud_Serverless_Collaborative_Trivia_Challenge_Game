const dynamoose = require("dynamoose");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
require("dotenv").config();

const dynamodb = new DynamoDB({ region: process.env.REGION });
dynamoose.aws.sdk = dynamodb;

const memberSchema = new dynamoose.Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  addedBy: { type: String, required: true }, // userid of the sender
  created_at: { type: Date, default: Date.now },
});

const teamSchema = new dynamoose.Schema({
  id: { type: String, hashKey: true, index: true },
  name: { type: String, required: true },
  userId: { type: String, required: true },
  members: {
    type: Array,
    default: [],
    schema: [memberSchema],
  },
  gamesPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  pointsEarned: { type: Number, default: 0 },
  updatedat: { type: Date, default: Date.now },
  createdat: { type: Date, default: Date.now },
});

module.exports = dynamoose.model("Teams", teamSchema);
