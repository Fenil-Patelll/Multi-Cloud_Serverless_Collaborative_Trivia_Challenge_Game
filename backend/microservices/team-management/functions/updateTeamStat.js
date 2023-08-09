const Team = require("./models/team.model");

const updateTeamStats = async (teamId, gamesPlayed, wins, losses, pointsEarned) => {
  try {
    const team = await Team.get(teamId);
    team.gamesPlayed = gamesPlayed;
    team.wins = wins;
    team.losses = losses;
    team.pointsEarned = pointsEarned;
    await team.save();
    return team;
  } catch (error) {
    throw new Error("Failed to update team stats.");
  }
};

module.exports.main = async (event) => {
  try {
    const { teamId } = event.pathParameters;
    const { gamesPlayed, wins, losses, pointsEarned } = JSON.parse(event.body);

    const team = await updateTeamStats(teamId, gamesPlayed, wins, losses, pointsEarned);
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(team),
    };

    return response;
  } catch (error) {
    const response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: "Failed to update team stats." }),
    };

    return response;
  }
};
