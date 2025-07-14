// src/utils/logger.ts
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, errors, json } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

export const logger = createLogger({
    level: "info",
    format: combine(
        timestamp(),
        errors({ stack: true }), // Capture stack trace if error object
        logFormat
    ),
    transports: [
        new transports.Console(),
        new DailyRotateFile({
            filename: "logs/app-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "7d",
        }),
    ],
});

// Shortcut functions
export const logInfo = (msg: string, meta?: any) => logger.info(msg, meta);
export const logError = (err: Error, meta?: any) =>
    logger.error(err.stack || err.message, meta);
