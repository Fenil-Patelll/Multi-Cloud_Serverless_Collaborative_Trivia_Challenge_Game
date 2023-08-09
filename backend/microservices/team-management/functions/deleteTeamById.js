const Team = require("./models/team.model");

const deleteTeam = async (id) => {
  try {
    await Team.delete(id);
    return { message: "Team deleted successfully." };
  } catch (error) {
    throw new Error("Failed to delete the team.");
  }
};

module.exports.main = async (event) => {
  try {
    const { id } = event.pathParameters;

    await deleteTeam(id);
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: "Team deleted successfully." }),
    };

    return response;
  } catch (error) {
    const response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: error.message }),
    };

    return response;
  }
};
