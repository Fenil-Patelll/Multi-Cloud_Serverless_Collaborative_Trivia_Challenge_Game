require('dotenv').config()
const app = require('../utils/firebase');
const { publishMessage } = require('../utils/pubsub');

const getTriviaGames = async (event, context) => {
    const headers =
    {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    }
    try {
        const gamesSnapshot = await app.firestore().collection('games').get();

        const games = [];
        gamesSnapshot.forEach((gameDoc) => {
            const game = gameDoc.data();
            games.push(game);
        });

        // Publish a message to the Pub/Sub topic for game updates
        const pubSubData = {
            games: games,
        };
        await publishMessage('available-games', pubSubData);

        return {
            statusCode: 200,
            'headers': {
                // 'Authorization': 'Bearer dummy',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(games)
        };
    } catch (error) {
        console.error('Error fetching trivia games:', error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ message: 'Internal server error', error: error }),
        };
    }
};

module.exports = { getTriviaGames };