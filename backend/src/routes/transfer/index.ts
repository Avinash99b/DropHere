import express from "express";

const app = express.Router();

app.use('/text',require("./textRoute"));

app.use('/file',require("./fileRoute"));

module.exports = app;