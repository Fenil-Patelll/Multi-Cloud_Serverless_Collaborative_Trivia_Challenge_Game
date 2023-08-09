const Team = require("./models/team.model");
const { v4: uuidv4 } = require("uuid");

const createTeam = async (name, userId, email) => {
  try {
    const adminMember = {
      id: uuidv4(),
      userId,
      email: email,
      role: "admin",
      status: "accepted",
      addedBy: userId,
    };
    const team = await Team.create({
      id: uuidv4(),
      userId,
      name,
      members: [adminMember],
    });
    return team;
  } catch (error) {
    throw new Error("Failed to create a team.");
  }
};

module.exports.main = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);

    const { name, userId, email } = requestBody;

    const team = await createTeam(name, userId, email);
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
      body: JSON.stringify({ error: error.message }),
    };

    return response;
  }
};
