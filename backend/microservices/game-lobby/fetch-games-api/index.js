const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const app = express();
app.use(express.json());

const fetchGamesRouter = require('./routes/fetch-games.route');
const sseRouter = require('./routes/sse.route');
const publishRouter = require('./routes/publish.route');

app.use(cors({
    origin: '*', 
    credentials: true
}));

app.use('/api/fetch-games', fetchGamesRouter);
app.use('/api/sse', sseRouter);
app.use('/api/publish', publishRouter);

module.exports.handler = serverless(app);