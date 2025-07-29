import express, {Request, Response, NextFunction} from "express";
import cors from "cors";
import {errorHandler} from "./Middleware/ErrorHandler";
import Router from "./routes/router"

const app = express();

//Using Cors to allow cross-origin requests
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(Router);

app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Route not found",
    });
})

app.use(errorHandler)

export default app;