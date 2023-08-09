const Team = require("./models/team.model");
const SnsService = require("./services/sns.service");

const acceptInvite = async (teamId, memberId, option) => {
  try {
    const team = await Team.get(teamId);
    const member = team.members.find((m) => m.id === memberId);
    if (member && member.status === "pending") {
      member.status = option == "accept" ? "accepted" : "declined";
      await team.save();

      const templateName = option == "accept" ? "TeamInvitationSuccess" : "TeamInvitationFailure";
      await SnsService.sendInvitationNotification(templateName, {
        teamName: team.name,
        teamId: team.id,
        memberId: member.id,
        email: member.email,
        role: member.role,
        status: member.status,
      });

      return team;
    } else {
      throw new Error(
        member && member.status !== "pending"
          ? "Invalid member status"
          : "Member not found in the team"
      );
    }
  } catch (error) {
    throw new Error("Failed to accept the invite.");
  }
};

module.exports.main = async (event) => {
  try {
    const messages = event.Records.map((record) => {
      return JSON.parse(record.body);
    });
    console.log("All Messages:" + JSON.stringify(messages));
    for (const message of messages) {
      console.log("Received message:", message.Message);
      const data = JSON.parse(message.Message);
      const team = await acceptInvite(data.teamId, data.memberId, data.option);
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(team),
      };
      return response;
    }
  } catch (error) {
    const response = {
      statusCode: error.message.includes("Invalid member status") ? 400 : 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: error.message }),
    };
    return response;
  }
};
