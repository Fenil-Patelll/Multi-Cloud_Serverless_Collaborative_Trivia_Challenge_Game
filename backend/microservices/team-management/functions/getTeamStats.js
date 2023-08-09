const Team = require("./models/team.model");

const getTeamStats = async (teamId) => {
  try {
    const team = await Team.get(teamId);
    return {
      id: teamId,
      gamesPlayed: team.gamesPlayed,
      wins: team.wins,
      losses: team.losses,
      pointsEarned: team.pointsEarned,
    };
  } catch (error) {
    throw new Error("Failed to fetch team stats.");
  }
};

module.exports.main = async (event) => {
  try {
    const { teamId } = event.pathParameters;

    const teamStats = await getTeamStats(teamId);
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(teamStats),
    };

    return response;
  } catch (error) {
    const response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: "Failed to fetch team stats." }),
    };

    return response;
  }
};
