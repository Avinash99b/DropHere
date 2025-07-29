import express, {Request, Response, NextFunction} from "express";
import cors from "cors";
import {errorHandler} from "./Middleware/ErrorHandler";


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

module.exports = app;