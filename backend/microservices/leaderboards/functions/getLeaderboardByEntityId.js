const admin = require("firebase-admin");

if (!admin.apps.length) {
  const serviceAccount = require("../serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const getLeaderboardByEntityId = async (entityId) => {
  try {
    const leaderboardSnapshot = await db
      .collection("leaderboard")
      .where("entityId", "==", entityId)
      .get();
    const leaderboard = [];

    leaderboardSnapshot.forEach((doc) => {
      leaderboard.push(doc.data());
    });

    return leaderboard;
  } catch (error) {
    throw new Error("Failed to retrieve leaderboard by Entity Id.");
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
    const { entityId } = request.body;
    const leaderboard = await getLeaderboardByEntityId(entityId);
    return response.status(200).json(leaderboard);
  } catch (error) {
    return response.status(500).json({message: "Failed to retrieve leaderboard by Entity Id.", error});
  }
};
