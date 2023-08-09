const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

const publishMessage = async (topicName, data) => {
  try {
    const topic = pubsub.topic(topicName);
    const dataBuffer = Buffer.from(JSON.stringify(data));
    const messageId = await topic.publish(dataBuffer);
    console.log(`Message ${messageId} published to topic ${topic.name}`);
  } catch (error) {
    console.error('Error publishing message:', error);
  }
};

module.exports = { publishMessage };
