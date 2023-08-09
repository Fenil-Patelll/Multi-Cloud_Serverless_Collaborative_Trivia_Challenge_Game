const admin = require('../utils/firebase');
const db = admin.firestore();
const { getAllActiveConnections, sendMessageToAllConnections } = require('../utils/websocketService');
const { publishToPubSub } = require('../utils/pubsub');

module.exports.main = async event => {
  const body = JSON.parse(event.body);
  let error_msg = '';

  try {
    // Add the document to Firestore
    const newGameDoc = await db.collection('games').add(body);
    console.log(`New game added with ID: ${newGameDoc.id}`);

    // Get the game details
    const gameDetails = (await newGameDoc.get()).data();
    console.log(`New game details: ${JSON.stringify(gameDetails)}`);

    // Publish to Google Pub/Sub
    const buffer = Buffer.from(JSON.stringify(gameDetails));
    await publishToPubSub(buffer);

    // Get all active WebSocket connections
    const connections = await getAllActiveConnections();

    // Send the game details to every connected client
    await sendMessageToAllConnections(connections, {
      data: "NEW_GAME_AVAILABLE",
      gameDetails,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, gameID: newGameDoc.id }),
    };
  } catch (error) {
    error_msg = error;
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process request', error_msg }),
    };
  }
};