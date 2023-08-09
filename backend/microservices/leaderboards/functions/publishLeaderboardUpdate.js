const { PubSub } = require("@google-cloud/pubsub");

const pubSubClient = new PubSub(process.env.PROJECT_ID);

async function publishMessage(message) {
  try {
    const topic = pubSubClient.topic(process.env.LEADERBOARD_TOPIC_NAME);
    const dataBuffer = Buffer.from(JSON.stringify(message));
    const messageId = await topic.publishMessage({ data: dataBuffer });
    console.log(`Message ${messageId} published to topic ${topic.name}`);
    return messageId;
  } catch (error) {
    console.error("Error publishing message:", error);
    throw error;
  }
}

module.exports.main = async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set("Access-Control-Allow-Methods", "*");
  response.set("Access-Control-Allow-Headers", "*");
  response.set("Access-Control-Max-Age", "3600");

  if(request.method === "OPTIONS") {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response.status(200).send();
  }

  try {
    const { entityId, entityType, gameId, category, result, totalScore } = request.body;
    const messageId = await publishMessage({
      entityId,
      entityType,
      gameId,
      category,
      result,
      totalScore,
    });
    console.log(messageId);
    return response.status(200).send({message: "Successfully published leaderboard update.",messageId});
  } catch (error) {
    console.log("Error:", error);
    return response.status(500).send("Failed to publish leaderboard update.");
  }
};
