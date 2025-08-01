import express from "express";
import "dotenv/config";
import {logger} from "./Utils/Logger";
import {initDB} from "./config/DBConfig";
import App from "./app";

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await initDB()

        logger.info("DB connection started")

        checkEnvVariables();

        logger.info("Environment variables checked successfully");

        startWebServerSetup()
        logger.info("Web server setup completed successfully");
    } catch (err) {
        logger.error("StartUp Failed:", err)
        throw err;
    }
})()

function checkEnvVariables() {
    const requiredEnvVars = ["PORT", "DATABASE_URL"];
    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            logger.error(`Missing environment variable: ${envVar}`);
            throw new Error(`Missing environment variable: ${envVar}`);
        }
    });
}

function startWebServerSetup() {
    App.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
        console.log(`Server is running on port ${PORT}`);
    });
}