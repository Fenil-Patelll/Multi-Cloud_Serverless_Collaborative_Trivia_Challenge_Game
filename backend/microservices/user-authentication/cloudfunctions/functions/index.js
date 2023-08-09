const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { router } = require("./routes/routes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

exports.app = functions.https.onRequest(app);
