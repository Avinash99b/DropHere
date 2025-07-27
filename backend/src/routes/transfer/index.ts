import express from "express";

const app = express.Router();

app.use('/text',require("./textRoute"));

module.exports = app;