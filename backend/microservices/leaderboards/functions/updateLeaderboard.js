const admin = require("firebase-admin");
const axios = require("axios");

if (!admin.apps.length) {
  const serviceAccount = require("../serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const getUserDetails = async () => {
  try {
    const response = await axios.get(`${process.env.FETCH_USER_DETAIL_URL}/getAllUsers`);
    const users = response.data;
    return users;
  } catch (error) {
    console.log("Error fetching user details:", error);
    console.error("Error fetching user details:", error);
    throw new Error("Failed to fetch user details.");
  }
};

const getTeamDetails = async (teamId) => {
  try {
    const response = await axios.get(`${process.env.FETCH_TEAM_DETAIL_URL}/api/teams/get/${teamId}`);
    const team = response.data;
    return team;
  } catch (error) {
    console.log("Error fetching team details:", error);
    console.error("Error fetching team details:", error);
    throw new Error("Failed to fetch team details.");
  }
};

const publishNotification = async (message) => {
  try {
    await axios.post(`${process.env.NOTIFICATION_URL}`, message, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return "successfully sent leaderboard notifications";
  } catch (error) {
    console.log("Error sending leaderboard notification:", error);
    console.error("Error sending leaderboard notification:", error);
    throw new Error("Error sending leaderboard notification.");
  }
};

const notifyPodiumUpdate = async (entityId, entityType, currentRank, updatedRank) => {
  const allUsers = await getUserDetails();
  
  let teamDetails;
  let playerDetails;

  if(entityType == "team"){
    teamDetails = await getTeamDetails(entityId);
  }else {
    playerDetails = allUsers.filter((player) => player.id == entityId)[0]; // Use [0] to get the first matching player
  }

  const notifications = allUsers.map(async (user) => {
    const entityName = entityType == "team" ? teamDetails.name : playerDetails.given_name + ' ' + playerDetails.family_name;
    await publishNotification({
      type: 'podiumUpdate',
      message: `New podium: ${entityName} is now ranked ${updatedRank}. Previous Rank: ${currentRank}`,
      userId: user.id
    });
  });

  await Promise.all(notifications);
};

const getEntityRank = async (entityId) => {
  const leaderboardSnapshot = await db
    .collection("leaderboard")
    .orderBy("totalPoints", "desc")
    .get();

  let currentRank = 0;

  for (let i = 0; i < leaderboardSnapshot.docs.length; i++) {
    const doc = leaderboardSnapshot.docs[i];
    if (doc.data().entityId === entityId) {
      currentRank = i + 1;
      break;
    }
  }

  if (currentRank === 0) {
    console.log("Entity not found in leaderboard.");
    throw new Error("Entity not found in leaderboard.");
  }

  return currentRank;
};

const updateLeaderboard = async (
  entityId,
  entityType,
  gameId,
  category,
  result,
  totalScore
) => {
  try {
    const leaderboardQuerySnapshot = await db
      .collection("leaderboard")
      .where("entityId", "==", entityId)
      .limit(1)
      .get();

    let leaderboardDocRef;
    let isNewEntry = true;

    if (leaderboardQuerySnapshot.empty) {
      leaderboardDocRef = db.collection("leaderboard").doc();
    } else {
      leaderboardDocRef = leaderboardQuerySnapshot.docs[0].ref;
      isNewEntry = false;
    }

    const numericTotalScore = Number(totalScore);

    if (isNaN(numericTotalScore)) {
      throw new Error("Invalid totalScore value. Please provide a number.");
    }

    await db.runTransaction(async (transaction) => {
      const leaderboardDoc = await transaction.get(leaderboardDocRef);

      if (!leaderboardDoc.exists) {
        const newEntry = {
          entityId,
          entityType,
          statistics: [
            {
              id: gameId,
              category,
              result,
              totalScore: numericTotalScore,
              created_at: admin.firestore.Timestamp.now(),
            },
          ],
          gamesPlayed: 1,
          wins: result === "win" ? 1 : 0,
          losses: result === "loss" ? 1 : 0,
          totalPoints: numericTotalScore,
          winPercentage: result === "win" ? 100 : 0,
          averageScore: numericTotalScore,
          updatedat: admin.firestore.Timestamp.now(),
          createdat: admin.firestore.Timestamp.now(),
        };

        transaction.set(leaderboardDocRef, newEntry);
      } else {
        const leaderboardEntry = leaderboardDoc.data();

        leaderboardEntry.statistics.push({
          id: gameId,
          category,
          result,
          totalScore: numericTotalScore,
          created_at: admin.firestore.Timestamp.now(),
        });

        leaderboardEntry.gamesPlayed += 1;
        leaderboardEntry.wins += result === "win" ? 1 : 0;
        leaderboardEntry.losses += result === "loss" ? 1 : 0;
        leaderboardEntry.totalPoints += numericTotalScore;
        leaderboardEntry.winPercentage =
          (leaderboardEntry.wins / leaderboardEntry.gamesPlayed) * 100;
        leaderboardEntry.averageScore =
          leaderboardEntry.totalPoints / leaderboardEntry.gamesPlayed;
        leaderboardEntry.updatedat = admin.firestore.Timestamp.now();

        transaction.update(leaderboardDocRef, leaderboardEntry);
      }
    });

    const message = isNewEntry
      ? "New leaderboard entry created."
      : "Leaderboard updated successfully.";
    return { message };
  } catch (error) {
    throw new Error("Failed to update leaderboard.");
  }
};

module.exports.main = async (message, context) => {
  try {
    const messagePayload = JSON.parse(
      Buffer.from(message.data, "base64").toString()
    );
    console.log(messagePayload);

    const currentRank = await getEntityRank(messagePayload.entityId);

    const leaderboardUpdate = await updateLeaderboard(
      messagePayload.entityId,
      messagePayload.entityType,
      messagePayload.gameId,
      messagePayload.category,
      messagePayload.result,
      messagePayload.totalScore
    );

    const updatedRank = await getEntityRank(messagePayload.entityId);
    console.log(`currentRank: ${currentRank} , NewRank: ${updatedRank}`);
    if (updatedRank < currentRank) {
      await notifyPodiumUpdate(messagePayload.entityId, messagePayload.entityType, currentRank, updatedRank);
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(leaderboardUpdate),
    };

    return response;
  } catch (error) {
    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update leaderboard." }),
    };

    return response;
  }
};
