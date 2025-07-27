// src/utils/logger.ts
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, errors, json } = format;

export const logger = createLogger({
    level: "info",
    format: combine(
        timestamp(),
        errors({ stack: true }), // Include error stack if available
        json()                   // Output logs in JSON format
    ),
    transports: [
        new transports.Console(),
        new DailyRotateFile({
            filename: "logs/app-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "7d",
            format: combine(
                timestamp(),
                errors({ stack: true }),
                json()
            ),
        }),
    ],
});

// Shortcut functions
export const logInfo = (msg: string, meta?: any) =>
    logger.info(msg, meta);

export const logError = (err: Error, meta?: any) =>
    logger.error({
        message: err.message,
        stack: err.stack,
        ...meta
    });
