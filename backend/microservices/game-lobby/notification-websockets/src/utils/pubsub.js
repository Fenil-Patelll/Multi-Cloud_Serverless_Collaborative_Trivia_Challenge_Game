const { PubSub } = require('@google-cloud/pubsub');
const PROJECT_ID = process.env.PROJECT_ID;
const pubsub = new PubSub();

const topicName = `projects/${PROJECT_ID}/topics/available-games`;

async function publishToPubSub(message) {

  const messageData = {
    data: message,
    attributes: {},
  };

  try {
    await pubsub.topic(topicName).publishMessage(messageData);
    console.log("Message published to Google Pub/Sub");
  } catch (error) {
    console.error("Error publishing message:", error);
    throw error;
  }
}

module.exports = { publishToPubSub };