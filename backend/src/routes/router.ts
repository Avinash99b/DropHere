import express from "express";

const router = express.Router();

// Importing all routes
router.use("/health", require("./health"));

router.use("/transfer", require("./transfer"));


module.exports = router;