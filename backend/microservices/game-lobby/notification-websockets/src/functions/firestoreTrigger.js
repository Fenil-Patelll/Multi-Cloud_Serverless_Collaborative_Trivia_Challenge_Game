require('dotenv').config()
const app = require('../utils/firebase');
const functions = require('firebase-functions');


module.exports.onNewGameAdded = functions.firestore
  .document('games/{gameId}')
  .onCreate(async (snap, context) => {
    const gameData = snap.data();
    // Perform any needed validations on gameData before sending the notification.

    // Send a notification to all connected clients
    // Replace this line with the appropriate code to send the notification
    // through your WebSocket server (e.g., using AWS API Gateway)
    console.log('New game added:', gameData);

    return null;
  });