import express from "express";

const router = express.Router();

// Importing all routes
router.use("/health", require("./health"));


module.exports = router;