const admin = require("firebase-admin");

if (!admin.apps.length) {
  const serviceAccount = require("../serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const filterLeaderboardByTimeFrame = async (timeFrame) => {
  try {
    let startDate;

    if (timeFrame === "all-time") {
      const leaderboardSnapshot = await db.collection("leaderboard").get();
      const leaderboard = [];
      leaderboardSnapshot.forEach((doc) => {
        leaderboard.push(doc.data());
      });
      return leaderboard;
    } else if (timeFrame === "daily") {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } else if (timeFrame === "weekly") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeFrame === "monthly") {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      throw new Error("Invalid time frame provided.");
    }

    const leaderboardSnapshot = await db
      .collection("leaderboard")
      .where("createdat", ">=", startDate)
      .get();

    const leaderboard = [];
    leaderboardSnapshot.forEach((doc) => {
      leaderboard.push(doc.data());
    });

    return leaderboard;
  } catch (error) {
    throw new Error("Failed to filter leaderboard by time frame.");
  }
};

module.exports.main = async (request, response) => {
  
  response.set('Access-Control-Allow-Origin', '*');
  response.set("Access-Control-Allow-Methods", "*");
  response.set("Access-Control-Allow-Headers", "*");
  response.set("Access-Control-Max-Age", "3600");

  if(request.method === "OPTIONS") {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response.status(200).send();
  }

  try {
    const { timeFrame } = request.body;
    const leaderboard = await filterLeaderboardByTimeFrame(timeFrame);
    return response.status(200).json(leaderboard);
  } catch (error) {
    return response.status(500).send({ error: "Failed to filter leaderboard by time frame." });
  }
};
