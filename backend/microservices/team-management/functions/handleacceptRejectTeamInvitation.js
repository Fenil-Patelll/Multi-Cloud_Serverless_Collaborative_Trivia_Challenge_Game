const SnsService = require("./services/sns.service");
const Teams = require("./models/team.model");

const getTeamDetails = async (teamId) => {
  try {
    const team = await Teams.get(teamId);
    return team;
  } catch (error) {
    console.error("Error fetching team details:", error);
    throw new Error("Failed to fetch team details.");
  }
};

const getUserDetails = async (userId) => {
  try {
    const response = await fetch(`${process.env.FETCH_USER_DETAIL_URL}/getuserbyuserid/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user details.");
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Failed to fetch user details.");
  }
};

const publishAcceptRejectNotification = async (teamId, memberId, option) => {
  try {
    const teamDetail = await getTeamDetails(teamId);
    const member = teamDetail.members.find((m) => m.id === memberId);
    const userDetail = await getUserDetails(member.userId);

    const type = option === "accept" ? "acceptInvite" : "rejectInvite";
    const userId = teamDetail.userId;
    const acceptedFromUserId = member.userId;
    const acceptedFromUserName = userDetail.given_name + ' ' + userDetail.family_name;
    const teamName = teamDetail.name;
    const message = option === "accept" ? `User ${acceptedFromUserName} has accepted your Invitation to join the game` : 
    `User ${acceptedFromUserName} has rejected your Invitation to join the game`;

    await SnsService.sendInGameNotification({
      type,
      userId,
      acceptedFromUserId,
      acceptedFromUserName,
      teamId,
      teamName,
      message
    });
  } catch (error) {
    throw new Error("Failed to send notification for accept/reject the invite.");
  }
};

const publishAcceptReject = async (teamId, memberId, option) => {
  try {
    await SnsService.publishAcceptRejectInvitation({
      teamId,
      memberId,
      option,
    });
    await publishAcceptRejectNotification(
      teamId,
      memberId,
      option,
    );
  } catch (error) {
    throw new Error("Failed to accept/reject the invite.");
  }
};

module.exports.main = async (event) => {
  try {
    const { teamId, memberId, option } = event.pathParameters;

    await publishAcceptReject(teamId, memberId, option);
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: `Successfully published team ${option} message`,
      }),
    };

    return response;
  } catch (error) {
    const response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        error: "Error publishing team accept/reject message",
      }),
    };
    return response;
  }
};
