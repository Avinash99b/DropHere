import firebase from "./config/FirebaseConfig";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import AppError from "./Errors/AppError";
import {logger} from "./Utils/Logger";
import {errorHandler} from "./Middleware/ErrorHandler";

dotenv.config();

const PORT = process.env.PORT || 3000;

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