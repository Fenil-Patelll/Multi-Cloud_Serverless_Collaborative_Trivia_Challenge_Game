const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const { router } = require("./routes/routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

module.exports.handler = serverless(app);