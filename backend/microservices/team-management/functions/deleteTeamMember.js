const Team = require("./models/team.model");

const deleteMember = async (teamId, memberId) => {
  try {
    const team = await Team.get(teamId);
    team.members = team.members.filter((member) => member.id !== memberId);
    await team.save();
    return team;
  } catch (error) {
    throw new Error("Failed to delete the member from the team.");
  }
};

module.exports.main = async (event) => {
  try {
    const { teamId, memberId } = event.pathParameters;

    const team = await deleteMember(teamId, memberId);
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
      body: JSON.stringify({ error: "Failed to delete the member from the team." }),
    };

    return response;
  }
};
