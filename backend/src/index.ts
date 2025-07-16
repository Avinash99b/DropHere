import firebase from "./config/FirebaseConfig";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import  "dotenv/config";
import AppError from "./Errors/AppError";
import {logger} from "./Utils/Logger";
import {errorHandler} from "./Middleware/ErrorHandler";
import {initDB} from "./config/DBConfig";

const PORT = process.env.PORT || 3000;

(async () => {
    try{
        await initDB()
        logger.info("DB connection started")

        startWebServerSetup()
    }catch(err){
        logger.error("DB connection error:", err)
    }
})()


function startWebServerSetup(){
    const app = express();

    //Using Cors to allow cross-origin requests
    app.use(cors());

    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));

    app.use(require("./routes/router"));

    app.use((req, res) => {
        res.status(404).json({
            status: "error",
            message: "Route not found",
        });
    })

    app.use(errorHandler)

    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
        console.log(`Server is running on port ${PORT}`);
    });
}