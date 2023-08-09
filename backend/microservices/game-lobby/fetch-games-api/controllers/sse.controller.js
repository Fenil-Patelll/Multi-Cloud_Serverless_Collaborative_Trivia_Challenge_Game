const { PubSub } = require('@google-cloud/pubsub');

const PROJECT_ID = 'psychic-surf-386517';

const subscribeToSSE = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');

    const pubsub = new PubSub();
    const subscriptionName = `projects/${PROJECT_ID}/subscriptions/available-games-sub`;
    const subscription = pubsub.subscription(subscriptionName);

    const messageHandler = (message) => {
        const gameData = message.data.toString();
        const event = `data: ${gameData}\n\n`;
        res.write(event);
    };

    const heartbeatInterval = setInterval(() => {
        res.write(':heartbeat\n\n');
    }, 5000); // Send heartbeat every 5 seconds

    subscription.on('message', messageHandler);

    // Send initial response
    res.write(':ok\n\n');

    // Handle SSE connection close event
    req.on('close', () => {
        subscription.removeListener('message', messageHandler);
        clearInterval(heartbeatInterval);
        res.end();
    });
};

module.exports = {
    subscribeToSSE,
};
