// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../Errors/AppError";
import { logError } from "../Utils/Logger";

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
):void {
    // Log the error with context
    logError(err, {
        path: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
        return;
    }

    // Unknown error fallback
    res.status(500).json({
        status: "error",
        message: "Internal Server Error",
    });
}
