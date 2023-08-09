const Team = require("./models/team.model");

const updateMember = async (teamId, memberId, role) => {
  try {
    const team = await Team.get(teamId);
    const member = team.members.find((m) => m.id === memberId);
    if (member) {
      member.role = role;
      await team.save();
      return team;
    } else {
      throw new Error("Member not found in the team.");
    }
  } catch (error) {
    throw new Error("Failed to update the member in the team.");
  }
};

module.exports.main = async (event) => {
  try {
    const { teamId, memberId } = event.pathParameters;
    const { role } = JSON.parse(event.body);

    const team = await updateMember(teamId, memberId, role);
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
      statusCode: error.message.includes("Member not found") ? 404 : 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: error.message }),
    };

    return response;
  }
};
