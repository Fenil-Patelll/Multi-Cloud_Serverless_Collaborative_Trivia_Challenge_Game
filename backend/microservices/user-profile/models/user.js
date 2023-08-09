const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.USERS_TABLE;

class User {
  constructor({ id, totalGamePlayed, win, loss, totalPoints, achievements }) {
    this.id = id;
    this.totalGamePlayed = totalGamePlayed;
    this.win = win;
    this.loss = loss;
    this.totalPoints = totalPoints;
    this.achievements = achievements;
  }

  async save() {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        id: this.id,
        totalGamePlayed: this.totalGamePlayed,
        win: this.win,
        loss: this.loss,
        totalPoints: this.totalPoints,
        achievements: this.achievements,
      },
    };

    await dynamodb.put(params).promise();
    return this;
  }

  static async get(id) {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id,
      },
    };

    const { Item } = await dynamodb.get(params).promise();

    if (!Item) {
      throw new Error("User not found");
    }

    return new User(Item);
  }

  static async update(id, userData) {
    const getUserparams = {
      TableName: TABLE_NAME,
      Key: {
        id,
      },
    };

    const response = await dynamodb.get(getUserparams).promise();
    const item = response.Item;

    item["win"] = (item["win"] || 0) + userData.win;
    item["loss"] = (item["loss"] || 0) + userData.loss;
    if(typeof(userData.totalPoints) === "string") {
      item["totalPoints"] = (item["totalPoints"] || 0) + parseInt(userData.totalPoints);
    } else {
      item["totalPoints"] = (item["totalPoints"] || 0) + userData.totalPoints;
    }
    item["totalGamePlayed"] =
      (item["totalGamePlayed"] || 0) + userData.totalGamePlayed;
    item["achievements"] = userData.achievements;
    const params = {
      TableName: TABLE_NAME,
      Item: item,
    };

    await dynamodb.put(params).promise();

    return item;
  }

  static async delete(id) {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id,
      },
    };

    await dynamodb.delete(params).promise();
  }

  static async getAll() {
    const params = {
      TableName: TABLE_NAME,
    };
    const { Items } = await dynamodb.scan(params).promise();

    return Items.map((item) => new User(item));
  }
}

module.exports = User;
