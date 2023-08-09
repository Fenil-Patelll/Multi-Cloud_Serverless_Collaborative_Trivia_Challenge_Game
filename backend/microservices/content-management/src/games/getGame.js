const { findGame } = require("../utils/findGame");

module.exports.main = async (event) => {
  const gameId = event.pathParameters.id;

  const game = await findGame(gameId);

  if (game) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(game),
    };
  } else {
    return {
      statusCode: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: `Game with ID ${gameId} not found.`,
    };
  }
};