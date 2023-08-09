const { PubSub } = require('@google-cloud/pubsub');

const PROJECT_ID = 'psychic-surf-386517';

const publishMessage = (req, res) => {
  const { message } = req.body;
  const pubsub = new PubSub();
  const topicName = `projects/${PROJECT_ID}/topics/available-games`;

  const dataBuffer = Buffer.from(message);
  const attributes = {};

  const messageData = {
    data: dataBuffer,
    attributes: attributes,
  };

  pubsub
    .topic(topicName)
    .publishMessage(messageData)
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch((error) => {
      console.error('Error publishing message:', error);
      res.status(500).json({ error: 'Failed to publish message' });
    });
};

module.exports = { publishMessage };
