const admin = require("firebase-admin");

if (!admin.apps.length) {
  const serviceAccount = require("../serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const getGlobalLeaderboard = async () => {
  try {
    const leaderboardSnapshot = await db.collection("leaderboard").get();
    const leaderboard = [];

    leaderboardSnapshot.forEach((doc) => {
      leaderboard.push(doc.data());
    });

    return leaderboard;
  } catch (error) {
    throw new Error("Failed to retrieve global leaderboard.");
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
    const leaderboard = await getGlobalLeaderboard();
    return response.status(200).json(leaderboard);
  } catch (error) {
    return response.status(500).send({error: "Failed to retrieve global leaderboard."});
  }
};
