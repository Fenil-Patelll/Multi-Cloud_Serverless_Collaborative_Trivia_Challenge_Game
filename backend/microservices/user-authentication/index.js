const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const { router } = require("./routes/routes");
const cookieParser = require('cookie-parser')

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['OPTIONS', 'POST', 'GET'],
    allowedHeaders: 'Content-Type',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json());
app.use(router);

module.exports.handler = serverless(app);
